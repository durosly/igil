import "server-only";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getClient } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import PaymentCode from "@/models/PaymentCode";
import { deleteObject } from "@/lib/storage";
import { betterAuthUserIdFilter } from "@/lib/admin/better-auth-user-filter";
import type {
	EnrollmentDeletionImpact,
	EnrollmentDeletionImpactCertificate,
	EnrollmentDeletionImpactPaymentCode,
} from "@/lib/admin/enrollment-deletion-types";
import { Types } from "mongoose";

export type { EnrollmentDeletionImpact };

export type GetEnrollmentDeletionImpactResult =
	| { ok: true; impact: EnrollmentDeletionImpact }
	| { ok: false; status: 401 | 403 | 404 | 500; error: string };

function programTitle(populated: unknown): { id: string; title: string } {
	if (populated && typeof populated === "object" && "_id" in populated) {
		const p = populated as { _id: unknown; title?: string };
		return { id: String(p._id), title: p.title ?? "—" };
	}
	return { id: String(populated), title: "—" };
}

function sessionLabelFromPopulated(populated: unknown): string | undefined {
	if (populated == null) return undefined;
	if (typeof populated === "object" && populated !== null && "_id" in populated) {
		const s = populated as { title?: string; year?: number };
		if (s.title != null && s.year != null) return `${s.title} (${s.year})`;
		return s.title ?? "—";
	}
	return "—";
}

export async function getEnrollmentDeletionImpactForAdmin(
	requestHeaders: Headers,
	enrollmentId: string
): Promise<GetEnrollmentDeletionImpactResult> {
	try {
		const session = await auth.api.getSession({ headers: requestHeaders });
		if (!session?.user) {
			return { ok: false, status: 401, error: "Unauthorized" };
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return { ok: false, status: 403, error: "Forbidden" };
		}

		await connectDB();
		const e = await Enrollment.findById(enrollmentId)
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.lean();
		if (!e) {
			return { ok: false, status: 404, error: "Enrollment not found" };
		}

		const db = await getClient();
		const userDoc = await db
			.collection("user")
			.findOne<{ name?: string; email?: string }>(betterAuthUserIdFilter(e.userId));

		const prog = programTitle(e.programId);
		const enrollmentSessionLabel = sessionLabelFromPopulated(e.sessionId);

		let certificate: EnrollmentDeletionImpactCertificate | null = null;
		let paymentCodes: EnrollmentDeletionImpactPaymentCode[] = [];

		if (Types.ObjectId.isValid(prog.id)) {
			const programOid = new Types.ObjectId(prog.id);

			const certDoc = await Certificate.findOne({
				userId: e.userId,
				programId: programOid,
			} as never)
				.populate("sessionId", "title year")
				.lean();

			if (certDoc) {
				certificate = {
					_id: String(certDoc._id),
					hasUploadedFile: !!certDoc.storageKey,
					originalFileName: certDoc.originalFileName,
					sessionLabel:
						sessionLabelFromPopulated(certDoc.sessionId) ?? enrollmentSessionLabel,
				};
			}

			const codeRows = await PaymentCode.find({
				userId: e.userId,
				programId: programOid,
			} as never)
				.sort({ createdAt: -1 })
				.lean();

			paymentCodes = codeRows.map((p) => ({
				_id: String(p._id),
				code: p.code,
				used: p.used,
			}));
		}

		return {
			ok: true,
			impact: {
				enrollmentId: String(e._id),
				studentName: userDoc?.name?.trim() || userDoc?.email?.trim() || "—",
				studentEmail: userDoc?.email,
				programTitle: prog.title,
				sessionLabel: enrollmentSessionLabel,
				source: e.source,
				certificate,
				paymentCodes,
			},
		};
	} catch (error) {
		console.error("Error building enrollment deletion impact:", error);
		return { ok: false, status: 500, error: "Failed to load enrollment" };
	}
}

export async function deleteEnrollmentCascade(
	enrollmentId: string
): Promise<{ ok: true } | { ok: false; status: 404 | 500; error: string }> {
	try {
		await connectDB();
		const enrollment = await Enrollment.findById(enrollmentId).lean();
		if (!enrollment) {
			return { ok: false, status: 404, error: "Enrollment not found" };
		}

		const programOid =
			enrollment.programId instanceof Types.ObjectId
				? enrollment.programId
				: new Types.ObjectId(String(enrollment.programId));
		const userId = enrollment.userId;

		const cert = await Certificate.findOne({
			userId,
			programId: programOid,
		} as never).lean();

		if (cert) {
			const key = cert.storageKey;
			if (typeof key === "string" && key.length > 0) {
				await deleteObject(key);
			}
		}

		await Certificate.deleteMany({ userId, programId: programOid } as never);
		await PaymentCode.deleteMany({ userId, programId: programOid } as never);
		await Enrollment.findByIdAndDelete(enrollmentId);

		return { ok: true };
	} catch (error) {
		console.error("Error deleting enrollment:", error);
		return { ok: false, status: 500, error: "Failed to delete enrollment" };
	}
}
