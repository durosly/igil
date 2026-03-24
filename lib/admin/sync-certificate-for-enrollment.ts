import "server-only";

import { Types } from "mongoose";
import Certificate from "@/models/Certificate";

export class SyncCertificateError extends Error {
	constructor(
		message: string,
		readonly code: "SESSION_REQUIRED"
	) {
		super(message);
		this.name = "SyncCertificateError";
	}
}

type LeanEnrollmentLike = {
	userId: string;
	programId: unknown;
	sessionId?: unknown;
	completedAt?: Date | null;
};

function toObjectId(id: unknown): Types.ObjectId {
	if (id instanceof Types.ObjectId) return id;
	if (typeof id === "object" && id !== null && "_id" in id) {
		return toObjectId((id as { _id: unknown })._id);
	}
	if (typeof id === "string" && Types.ObjectId.isValid(id)) return new Types.ObjectId(id);
	throw new Error("Invalid ObjectId");
}

/**
 * After enrollment `completedAt` / `sessionId` changes, keep the Certificate row in sync
 * (unique per userId + programId). Deletes the certificate when completion is cleared.
 */
export async function syncCertificateForEnrollment(enrollment: LeanEnrollmentLike): Promise<void> {
	const userId = enrollment.userId;
	const programId = toObjectId(enrollment.programId);

	const completedAt = enrollment.completedAt ? new Date(enrollment.completedAt) : null;
	const filter = { userId, programId };

	if (!completedAt) {
		await Certificate.deleteOne(filter as never);
		return;
	}

	const rawSession = enrollment.sessionId;
	if (rawSession == null) {
		throw new SyncCertificateError(
			"Assign a session before marking the enrollment complete",
			"SESSION_REQUIRED"
		);
	}

	let sessionId: Types.ObjectId;
	if (rawSession instanceof Types.ObjectId) {
		sessionId = rawSession;
	} else if (typeof rawSession === "object" && rawSession !== null && "_id" in rawSession) {
		sessionId = toObjectId((rawSession as { _id: unknown })._id);
	} else {
		sessionId = toObjectId(rawSession);
	}

	const existing = await Certificate.findOne(filter as never).lean();

	if (existing) {
		await Certificate.updateOne(
			{ _id: existing._id },
			{
				$set: {
					sessionId,
					completedAt,
				},
			}
		);
		return;
	}

	await Certificate.create({
		userId,
		programId,
		sessionId,
		completedAt,
		downloadCount: 0,
	} as never);
}
