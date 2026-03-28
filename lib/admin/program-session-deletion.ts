import "server-only";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getClient } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import ProgramSession from "@/models/ProgramSession";
import { deleteObject } from "@/lib/storage";
import {
	betterAuthUserDocumentId,
	betterAuthUserIdFilter,
} from "@/lib/admin/better-auth-user-filter";
import type {
	SessionDeletionImpact,
	SessionDeletionImpactCertificate,
	SessionDeletionImpactEnrollment,
} from "@/lib/admin/session-deletion-types";
import type { IEnrollment } from "@/models/Enrollment";
import { Types } from "mongoose";

export type { SessionDeletionImpact };

export type GetSessionDeletionImpactResult =
	| { ok: true; impact: SessionDeletionImpact }
	| { ok: false; status: 401 | 403 | 404 | 500; error: string };

function titleFromProgramRef(populated: unknown): string {
	if (populated && typeof populated === "object" && "title" in populated) {
		return String((populated as { title?: string }).title ?? "—");
	}
	return "—";
}

async function displayNamesForUserIds(userIds: string[]): Promise<Map<string, string>> {
	const unique = [...new Set(userIds.filter((u) => typeof u === "string" && u.length > 0))];
	const map = new Map<string, string>();
	if (unique.length === 0) return map;

	const db = await getClient();
	const userDocs = await db
		.collection("user")
		.find({ $or: unique.map((uid) => betterAuthUserIdFilter(uid)) })
		.project<{ id?: string; _id?: unknown; name?: string; email?: string }>({
			name: 1,
			email: 1,
			id: 1,
		})
		.toArray();

	for (const doc of userDocs) {
		const label = doc.name?.trim() || doc.email?.trim() || "—";
		const resolved = betterAuthUserDocumentId(doc);
		if (resolved) map.set(resolved, label);
		if (typeof doc.id === "string" && doc.id) map.set(doc.id, label);
	}
	return map;
}

export async function getSessionDeletionImpactForAdmin(
	requestHeaders: Headers,
	sessionId: string
): Promise<GetSessionDeletionImpactResult> {
	try {
		const session = await auth.api.getSession({ headers: requestHeaders });
		if (!session?.user) {
			return { ok: false, status: 401, error: "Unauthorized" };
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return { ok: false, status: 403, error: "Forbidden" };
		}

		if (!Types.ObjectId.isValid(sessionId)) {
			return { ok: false, status: 404, error: "Session not found" };
		}

		await connectDB();
		const sessionOid = new Types.ObjectId(sessionId);

		const doc = await ProgramSession.findById(sessionId).populate("programId", "title").lean();
		if (!doc) {
			return { ok: false, status: 404, error: "Session not found" };
		}

		const programTitle = titleFromProgramRef(doc.programId);
		const sessionTitle = doc.title ?? "—";
		const year = doc.year ?? 0;

		const certRows = await Certificate.find({
			sessionId: sessionOid,
		} as never)
			.populate("programId", "title")
			.sort({ createdAt: -1 })
			.lean();

		const enrollmentRows = await Enrollment.find({
			sessionId: sessionOid as unknown as NonNullable<IEnrollment["sessionId"]>,
		} as never)
			.sort({ createdAt: -1 })
			.lean();

		const userIds = [
			...certRows.map((c) => c.userId),
			...enrollmentRows.map((e) => e.userId),
		];
		const names = await displayNamesForUserIds(userIds);

		const certificates: SessionDeletionImpactCertificate[] = certRows.map((c) => ({
			_id: String(c._id),
			userId: c.userId,
			userName: names.get(c.userId) ?? "—",
			programTitle: titleFromProgramRef(c.programId),
			hasUploadedFile: !!c.storageKey,
			originalFileName: c.originalFileName,
		}));

		const enrollments: SessionDeletionImpactEnrollment[] = enrollmentRows.map((e) => ({
			_id: String(e._id),
			userId: e.userId,
			userName: names.get(e.userId) ?? "—",
		}));

		return {
			ok: true,
			impact: {
				sessionId,
				programTitle,
				sessionTitle,
				year,
				certificates,
				enrollments,
			},
		};
	} catch (error) {
		console.error("Error building session deletion impact:", error);
		return { ok: false, status: 500, error: "Failed to load session" };
	}
}

/** Deletes the session and cascades: certificate rows (+ storage), clears sessionId on enrollments. */
export async function deleteProgramSessionCascade(sessionId: string): Promise<
	| { ok: true }
	| { ok: false; status: 404 | 500; error: string }
> {
	try {
		if (!Types.ObjectId.isValid(sessionId)) {
			return { ok: false, status: 404, error: "Session not found" };
		}

		await connectDB();
		const sessionOid = new Types.ObjectId(sessionId);

		const existing = await ProgramSession.findById(sessionId).lean();
		if (!existing) {
			return { ok: false, status: 404, error: "Session not found" };
		}

		const certs = await Certificate.find({ sessionId: sessionOid } as never).lean();
		for (const c of certs) {
			const key = c.storageKey;
			if (typeof key === "string" && key.length > 0) {
				await deleteObject(key);
			}
		}

		await Certificate.deleteMany({ sessionId: sessionOid } as never);
		await Enrollment.updateMany(
			{
				sessionId: sessionOid as unknown as NonNullable<IEnrollment["sessionId"]>,
			} as never,
			{ $unset: { sessionId: "" } }
		);
		await ProgramSession.deleteOne({ _id: sessionOid } as never);

		return { ok: true };
	} catch (error) {
		console.error("Error deleting program session:", error);
		return { ok: false, status: 500, error: "Failed to delete session" };
	}
}
