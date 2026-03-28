import "server-only";

import { getClient } from "@/lib/db";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import {
	betterAuthUserDocumentId,
	betterAuthUserIdFilter,
} from "@/lib/admin/better-auth-user-filter";

const USER_MATCH_LIMIT = 80;

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeName(s: string): string {
	return s.trim().replace(/\s+/g, " ");
}

function toIso(d: unknown): string | undefined {
	if (d == null) return undefined;
	if (d instanceof Date) return d.toISOString();
	const t = new Date(d as string);
	return Number.isNaN(t.getTime()) ? undefined : t.toISOString();
}

function sessionLabel(sessionId: unknown): string {
	if (typeof sessionId === "object" && sessionId !== null && "title" in sessionId) {
		const s = sessionId as { title: string; year?: number };
		return `${s.title}${s.year != null ? ` (${s.year})` : ""}`;
	}
	return "—";
}

function programTitle(programId: unknown): string {
	if (typeof programId === "object" && programId !== null && "title" in programId) {
		return String((programId as { title: string }).title);
	}
	return "—";
}

export type PublicCertificateRow = {
	certificateNumber?: string;
	programTitle: string;
	sessionLabel: string;
	issuedAt?: string;
	completedAt: string;
	hasDocument: boolean;
};

export type CertificateVerificationRow = {
	fullName: string;
	certificates: PublicCertificateRow[];
};

function serializeCert(c: unknown): PublicCertificateRow {
	const o = c as {
		certificateNumber?: string;
		programId?: unknown;
		sessionId?: unknown;
		issuedAt?: unknown;
		completedAt?: unknown;
		documentUrl?: string;
		storageKey?: string;
	};
	const completed = toIso(o.completedAt);
	return {
		certificateNumber: o.certificateNumber,
		programTitle: programTitle(o.programId),
		sessionLabel: sessionLabel(o.sessionId),
		issuedAt: toIso(o.issuedAt),
		completedAt: completed ?? "",
		hasDocument: Boolean(o.documentUrl || o.storageKey),
	};
}

export async function lookupCertificatesByQuery(
	rawQuery: string
): Promise<
	| { ok: true; results: CertificateVerificationRow[] }
	| { ok: false; error: string; status: number }
> {
	const q = normalizeName(rawQuery);
	if (!q) {
		return { ok: false, error: "Enter a certificate number or full name.", status: 400 };
	}

	await connectDB();
	const db = await getClient();

	const certByNumber = await Certificate.findOne({
		certificateNumber: { $regex: `^${escapeRegex(q)}$`, $options: "i" },
	})
		.populate("programId", "title")
		.populate("sessionId", "title year")
		.lean();

	if (certByNumber) {
		const uid = String(certByNumber.userId);
		const userDoc = await db
			.collection("user")
			.findOne<{ name?: string }>(betterAuthUserIdFilter(uid));
		const fullName = userDoc?.name?.trim() || "—";
		return {
			ok: true,
			results: [
				{
					fullName,
					certificates: [serializeCert(certByNumber)],
				},
			],
		};
	}

	const namePatternParts = q.split(" ").filter(Boolean);
	if (namePatternParts.length === 0) {
		return { ok: false, error: "Enter a certificate number or full name.", status: 400 };
	}
	const namePattern = `^\\s*${namePatternParts.map((p) => escapeRegex(p)).join("\\s+")}\\s*$`;

	const userDocs = await db
		.collection("user")
		.find({
			role: "student",
			name: { $regex: namePattern, $options: "i" },
		})
		.project<{ id?: string; _id?: unknown; name?: string }>({ name: 1, id: 1 })
		.limit(USER_MATCH_LIMIT)
		.toArray();

	const normalizedTarget = q.toLowerCase();
	const matchedUsers = userDocs.filter(
		(u) => normalizeName(u.name ?? "").toLowerCase() === normalizedTarget
	);

	if (matchedUsers.length === 0) {
		return { ok: true, results: [] };
	}

	const userIds = matchedUsers
		.map((u) => betterAuthUserDocumentId(u))
		.filter((id): id is string => Boolean(id));

	const certs = await Certificate.find({ userId: { $in: userIds } })
		.populate("programId", "title")
		.populate("sessionId", "title year")
		.lean();

	const byUser = new Map<string, (typeof certs)[number][]>();
	for (const c of certs) {
		const id = String(c.userId);
		const list = byUser.get(id) ?? [];
		list.push(c);
		byUser.set(id, list);
	}

	const results: CertificateVerificationRow[] = matchedUsers.map((u) => {
		const id = betterAuthUserDocumentId(u);
		const fullName = u.name?.trim() || "—";
		const userCerts = id ? (byUser.get(id) ?? []) : [];
		return {
			fullName,
			certificates: userCerts.map((c) => serializeCert(c)),
		};
	});

	return { ok: true, results };
}
