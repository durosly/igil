import "server-only";

import { auth } from "@/lib/auth";
import { betterAuthUserIdFilter } from "@/lib/admin/better-auth-user-filter";
import connectDB from "@/lib/db";
import { getClient } from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export type AdminEnrollmentDetail = {
	_id: string;
	userId: string;
	studentName?: string;
	studentEmail?: string;
	programId: string;
	programTitle: string;
	sessionId?: string;
	sessionLabel?: string;
	source: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type GetEnrollmentForAdminResult =
	| { ok: true; enrollment: AdminEnrollmentDetail }
	| { ok: false; status: 401 | 403 | 404 | 500; error: string };

function programTitle(populated: unknown): { id: string; title: string } {
	if (populated && typeof populated === "object" && "_id" in populated) {
		const p = populated as { _id: unknown; title?: string };
		return { id: String(p._id), title: p.title ?? "—" };
	}
	return { id: String(populated), title: "—" };
}

function sessionLabel(populated: unknown): { id: string; label: string } | undefined {
	if (populated == null) return undefined;
	if (typeof populated === "object" && populated !== null && "_id" in populated) {
		const s = populated as { _id: unknown; title?: string; year?: number };
		const label =
			s.title != null && s.year != null ? `${s.title} (${s.year})` : (s.title ?? "—");
		return { id: String(s._id), label };
	}
	return { id: String(populated), label: "—" };
}

export async function getEnrollmentForAdmin(
	requestHeaders: Headers,
	enrollmentId: string
): Promise<GetEnrollmentForAdminResult> {
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
		const sess = sessionLabel(e.sessionId);

		return {
			ok: true,
			enrollment: {
				_id: String(e._id),
				userId: e.userId,
				studentName: userDoc?.name,
				studentEmail: userDoc?.email,
				programId: prog.id,
				programTitle: prog.title,
				sessionId: sess?.id,
				sessionLabel: sess?.label,
				source: e.source,
				profileApproved: e.profileApproved,
				programApproved: e.programApproved,
				paymentApproved: e.paymentApproved,
				createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : undefined,
				updatedAt: e.updatedAt ? new Date(e.updatedAt).toISOString() : undefined,
			},
		};
	} catch (error) {
		console.error("Error loading enrollment for admin:", error);
		return { ok: false, status: 500, error: "Failed to load enrollment" };
	}
}
