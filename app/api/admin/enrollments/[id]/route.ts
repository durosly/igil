import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import ProgramSession from "@/models/ProgramSession";
import { getEnrollmentForAdmin } from "@/lib/admin/get-enrollment-for-admin";
import {
	syncCertificateForEnrollment,
	SyncCertificateError,
} from "@/lib/admin/sync-certificate-for-enrollment";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const result = await getEnrollmentForAdmin(request.headers, id);
	if (!result.ok) {
		return NextResponse.json({ error: result.error }, { status: result.status });
	}
	return NextResponse.json(result.enrollment);
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id } = await params;
		const body = await request.json();
		const { profileApproved, programApproved, paymentApproved, sessionId, completedAt } = body;

		const hasSessionKey = Object.prototype.hasOwnProperty.call(body, "sessionId");
		const hasCompletedAtKey = Object.prototype.hasOwnProperty.call(body, "completedAt");
		if (
			profileApproved === undefined &&
			programApproved === undefined &&
			paymentApproved === undefined &&
			!hasSessionKey &&
			!hasCompletedAtKey
		) {
			return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
		}

		await connectDB();
		const enrollment = await Enrollment.findById(id).lean();
		if (!enrollment) {
			return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
		}

		let nextCompletedAt: Date | null = enrollment.completedAt
			? new Date(enrollment.completedAt)
			: null;
		if (hasCompletedAtKey) {
			if (completedAt === null || completedAt === "") {
				nextCompletedAt = null;
			} else {
				const d = new Date(completedAt);
				if (Number.isNaN(d.getTime())) {
					return NextResponse.json({ error: "Invalid completedAt date" }, { status: 400 });
				}
				nextCompletedAt = d;
			}
		}

		const completedAfterUpdate: Date | null = hasCompletedAtKey
			? nextCompletedAt
			: enrollment.completedAt
				? new Date(enrollment.completedAt)
				: null;

		let sessionAfterUpdate = !!enrollment.sessionId;
		if (hasSessionKey) {
			sessionAfterUpdate = !(sessionId == null || sessionId === "");
		}

		if (hasSessionKey && (sessionId == null || sessionId === "") && completedAfterUpdate) {
			return NextResponse.json(
				{ error: "Clear completion before removing the session" },
				{ status: 400 }
			);
		}

		if (completedAfterUpdate && !sessionAfterUpdate) {
			return NextResponse.json(
				{ error: "Assign a session before marking the enrollment complete" },
				{ status: 400 }
			);
		}

		const $set: Record<string, unknown> = {};
		const $unset: Record<string, "" | 1> = {};

		if (profileApproved !== undefined) $set.profileApproved = !!profileApproved;
		if (programApproved !== undefined) $set.programApproved = !!programApproved;
		if (paymentApproved !== undefined) $set.paymentApproved = !!paymentApproved;

		if (hasCompletedAtKey) {
			if (nextCompletedAt) {
				$set.completedAt = nextCompletedAt;
			} else {
				$unset.completedAt = "";
			}
		}

		if (hasSessionKey) {
			if (sessionId == null || sessionId === "") {
				$unset.sessionId = "";
			} else {
				const progSession = await ProgramSession.findById(String(sessionId)).lean();
				if (!progSession) {
					return NextResponse.json({ error: "Session not found" }, { status: 400 });
				}
				const enrollProgramId = String(enrollment.programId);
				const sessProgramId = String(progSession.programId);
				if (sessProgramId !== enrollProgramId) {
					return NextResponse.json(
						{ error: "Session does not belong to this program" },
						{ status: 400 }
					);
				}
				$set.sessionId = sessionId;
			}
		}

		const updatePayload: { $set?: typeof $set; $unset?: typeof $unset } = {};
		if (Object.keys($set).length) updatePayload.$set = $set;
		if (Object.keys($unset).length) updatePayload.$unset = $unset;

		const updated = await Enrollment.findByIdAndUpdate(id, updatePayload, {
			new: true,
		})
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.lean();

		if (!updated) {
			return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
		}

		try {
			await syncCertificateForEnrollment(updated);
		} catch (err) {
			if (err instanceof SyncCertificateError) {
				return NextResponse.json({ error: err.message }, { status: 400 });
			}
			throw err;
		}

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating enrollment:", error);
		return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
	}
}
