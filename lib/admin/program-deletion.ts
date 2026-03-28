import "server-only";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import PaymentCode from "@/models/PaymentCode";
import Program from "@/models/Program";
import ProgramSession from "@/models/ProgramSession";
import { deleteObject } from "@/lib/storage";
import type { ProgramDeletionImpact, ProgramDeletionSessionRow } from "@/lib/admin/program-deletion-types";
import { Types } from "mongoose";

export type { ProgramDeletionImpact };

export type GetProgramDeletionImpactResult =
	| { ok: true; impact: ProgramDeletionImpact }
	| { ok: false; status: 401 | 403 | 404 | 500; error: string };

const SESSION_PREVIEW_LIMIT = 25;

/** If `url` is under R2_PUBLIC_BASE_URL, return the object key; otherwise null. */
export function publicUrlToStorageKey(url: string | undefined): string | null {
	if (!url || typeof url !== "string") return null;
	const base = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "");
	if (!base) return null;
	if (!url.startsWith(base)) return null;
	const rest = url.slice(base.length).replace(/^\//, "");
	return rest.length > 0 ? rest : null;
}

async function buildProgramDeletionImpact(programId: string): Promise<ProgramDeletionImpact | null> {
	if (!Types.ObjectId.isValid(programId)) return null;

	await connectDB();
	const programOid = new Types.ObjectId(programId);

	const program = await Program.findById(programId).lean();
	if (!program) return null;

	const title = program.title ?? "—";
	const coverUrl = program.coverImageUrl;
	const hasCoverImageUrl = !!(coverUrl && String(coverUrl).trim());
	const willRemoveCoverFromStorage = publicUrlToStorageKey(
		typeof coverUrl === "string" ? coverUrl : undefined
	) != null;

	const sessionDocs = await ProgramSession.find({ programId: programOid } as never)
		.sort({ year: -1 })
		.limit(SESSION_PREVIEW_LIMIT)
		.lean();

	const sessions: ProgramDeletionSessionRow[] = sessionDocs.map((s) => ({
		title: s.title ?? "—",
		year: s.year ?? 0,
	}));

	const sessionCount = await ProgramSession.countDocuments({ programId: programOid } as never);
	const enrollmentCount = await Enrollment.countDocuments({ programId: programOid } as never);

	const certDocs = await Certificate.find({ programId: programOid } as never).lean();
	const certificateCount = certDocs.length;
	const certificatesWithUploadedFile = certDocs.filter((c) => !!c.storageKey).length;

	const paymentCodeCount = await PaymentCode.countDocuments({ programId: programOid } as never);

	return {
		programId,
		title,
		sessionCount,
		sessions,
		enrollmentCount,
		certificateCount,
		certificatesWithUploadedFile,
		paymentCodeCount,
		willRemoveCoverFromStorage,
		hasCoverImageUrl,
	};
}

export async function getProgramDeletionImpactForAdmin(
	requestHeaders: Headers,
	programId: string
): Promise<GetProgramDeletionImpactResult> {
	try {
		const session = await auth.api.getSession({ headers: requestHeaders });
		if (!session?.user) {
			return { ok: false, status: 401, error: "Unauthorized" };
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return { ok: false, status: 403, error: "Forbidden" };
		}

		const impact = await buildProgramDeletionImpact(programId);
		if (!impact) {
			return { ok: false, status: 404, error: "Program not found" };
		}
		return { ok: true, impact };
	} catch (error) {
		console.error("Error building program deletion impact:", error);
		return { ok: false, status: 500, error: "Failed to load program" };
	}
}

export async function deleteProgramCascade(
	programId: string
): Promise<{ ok: true } | { ok: false; status: 404 | 500; error: string }> {
	try {
		if (!Types.ObjectId.isValid(programId)) {
			return { ok: false, status: 404, error: "Program not found" };
		}

		await connectDB();
		const programOid = new Types.ObjectId(programId);

		const program = await Program.findById(programId).lean();
		if (!program) {
			return { ok: false, status: 404, error: "Program not found" };
		}

		const certs = await Certificate.find({ programId: programOid } as never).lean();
		for (const c of certs) {
			const key = c.storageKey;
			if (typeof key === "string" && key.length > 0) {
				await deleteObject(key);
			}
		}
		await Certificate.deleteMany({ programId: programOid } as never);

		await PaymentCode.deleteMany({ programId: programOid } as never);
		await Enrollment.deleteMany({ programId: programOid } as never);
		await ProgramSession.deleteMany({ programId: programOid } as never);

		const coverKey = publicUrlToStorageKey(
			typeof program.coverImageUrl === "string" ? program.coverImageUrl : undefined
		);
		if (coverKey) {
			try {
				await deleteObject(coverKey);
			} catch (e) {
				console.error("Failed to delete program cover from storage:", e);
			}
		}

		await Program.deleteOne({ _id: programOid } as never);

		return { ok: true };
	} catch (error) {
		console.error("Error deleting program cascade:", error);
		return { ok: false, status: 500, error: "Failed to delete program" };
	}
}
