import "server-only";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getClient } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import PaymentCode from "@/models/PaymentCode";
import {
	betterAuthUserDocumentId,
	betterAuthUserIdFilter,
} from "@/lib/admin/better-auth-user-filter";
import type {
	StudentDeletionImpact,
	StudentDeletionImpactCertificate,
	StudentDeletionImpactPaymentCode,
} from "@/lib/admin/student-deletion-types";

export type { StudentDeletionImpact, StudentDeletionImpactCertificate, StudentDeletionImpactPaymentCode };

export type AdminStudentDetail = {
	id: string;
	name?: string;
	email?: string;
	role?: string;
	profileApproved?: boolean;
	enrollments: {
		_id: string;
		programId: string;
		programTitle: string;
		sessionLabel?: string;
		source: string;
		profileApproved: boolean;
		programApproved: boolean;
		paymentApproved: boolean;
	}[];
	deletionImpact: StudentDeletionImpact;
};

export type GetStudentForAdminResult =
	| { ok: true; student: AdminStudentDetail }
	| { ok: false; status: 401 | 403 | 404 | 500; error: string };

function programTitle(populated: unknown): { id: string; title: string } {
	if (populated && typeof populated === "object" && "_id" in populated) {
		const p = populated as { _id: unknown; title?: string };
		return { id: String(p._id), title: p.title ?? "—" };
	}
	return { id: String(populated), title: "—" };
}

function sessionLabel(populated: unknown): string | undefined {
	if (populated == null) return undefined;
	if (typeof populated === "object" && populated !== null && "_id" in populated) {
		const s = populated as { title?: string; year?: number };
		if (s.title != null && s.year != null) return `${s.title} (${s.year})`;
		return s.title ?? "—";
	}
	return "—";
}

export async function getStudentForAdmin(
	requestHeaders: Headers,
	userId: string
): Promise<GetStudentForAdminResult> {
	try {
		const session = await auth.api.getSession({ headers: requestHeaders });
		if (!session?.user) {
			return { ok: false, status: 401, error: "Unauthorized" };
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return { ok: false, status: 403, error: "Forbidden" };
		}

		const db = await getClient();
		const userDoc = await db
			.collection("user")
			.findOne<{
				id?: string;
				_id?: unknown;
				name?: string;
				email?: string;
				role?: string;
				profileApproved?: boolean;
			}>(betterAuthUserIdFilter(userId));
		if (!userDoc) {
			return { ok: false, status: 404, error: "Student not found" };
		}
		if (userDoc.role && userDoc.role !== "student") {
			return { ok: false, status: 404, error: "Student not found" };
		}

		await connectDB();
		const rows = await Enrollment.find({ userId })
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.sort({ createdAt: -1 })
			.lean();

		const enrollments = rows.map((e) => {
			const prog = programTitle(e.programId);
			return {
				_id: String(e._id),
				programId: prog.id,
				programTitle: prog.title,
				sessionLabel: sessionLabel(e.sessionId),
				source: e.source,
				profileApproved: e.profileApproved,
				programApproved: e.programApproved,
				paymentApproved: e.paymentApproved,
			};
		});

		const resolvedId = betterAuthUserDocumentId(userDoc) || userId;

		const certRows = await Certificate.find({ userId })
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.sort({ createdAt: -1 })
			.lean();

		const certificates: StudentDeletionImpactCertificate[] = certRows.map((c) => {
			const prog = programTitle(c.programId);
			return {
				_id: String(c._id),
				programTitle: prog.title,
				sessionLabel: sessionLabel(c.sessionId),
				originalFileName: c.originalFileName,
				hasUploadedFile: !!c.storageKey,
			};
		});

		const paymentRows = await PaymentCode.find({ userId })
			.populate("programId", "title")
			.sort({ createdAt: -1 })
			.lean();

		const paymentCodes: StudentDeletionImpactPaymentCode[] = paymentRows.map((p) => {
			const prog = programTitle(p.programId);
			return {
				_id: String(p._id),
				code: p.code,
				programTitle: prog.title,
				used: p.used,
			};
		});

		return {
			ok: true,
			student: {
				id: resolvedId,
				name: userDoc.name,
				email: userDoc.email,
				role: userDoc.role,
				profileApproved: userDoc.profileApproved,
				enrollments,
				deletionImpact: { certificates, paymentCodes },
			},
		};
	} catch (error) {
		console.error("Error loading student for admin:", error);
		return { ok: false, status: 500, error: "Failed to load student" };
	}
}
