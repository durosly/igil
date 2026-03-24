import "server-only";

import { Types } from "mongoose";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import PaymentCode from "@/models/PaymentCode";

export type StudentEnrollmentProgram = {
	_id: string;
	title: string;
	description?: string;
	paymentInstruction?: string;
	status: string;
	coverImageUrl?: string;
};

export type StudentEnrollmentSession = {
	_id: string;
	title?: string;
	year?: number;
	label: string;
};

export type StudentPaymentCodeRow = {
	_id: string;
	code: string;
	type: string;
	used: boolean;
	amount?: number;
	partIndex?: number;
	createdAt?: string;
};

export type StudentEnrollmentDetail = {
	_id: string;
	source: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	completedAt?: string;
	createdAt?: string;
	updatedAt?: string;
	program: StudentEnrollmentProgram | null;
	session?: StudentEnrollmentSession;
	paymentCodes: StudentPaymentCodeRow[];
};

export type GetEnrollmentForStudentResult =
	| { ok: true; enrollment: StudentEnrollmentDetail }
	| { ok: false; status: 401 | 403 | 404 | 500; error: string };

function mapProgram(populated: unknown): StudentEnrollmentProgram | null {
	if (populated == null) return null;
	if (typeof populated === "object" && "_id" in populated) {
		const p = populated as {
			_id: unknown;
			title?: string;
			description?: string;
			paymentInstruction?: string;
			status?: string;
			coverImageUrl?: string;
		};
		return {
			_id: String(p._id),
			title: p.title ?? "—",
			description: p.description,
			paymentInstruction: p.paymentInstruction,
			status: p.status ?? "—",
			coverImageUrl: p.coverImageUrl,
		};
	}
	return null;
}

function mapSession(populated: unknown): StudentEnrollmentSession | undefined {
	if (populated == null) return undefined;
	if (typeof populated === "object" && "_id" in populated) {
		const s = populated as { _id: unknown; title?: string; year?: number };
		const label =
			s.title != null && s.year != null ? `${s.title} (${s.year})` : (s.title ?? "—");
		return {
			_id: String(s._id),
			title: s.title,
			year: s.year,
			label,
		};
	}
	return undefined;
}

export async function getEnrollmentForStudent(
	requestHeaders: Headers,
	enrollmentId: string
): Promise<GetEnrollmentForStudentResult> {
	try {
		const session = await auth.api.getSession({ headers: requestHeaders });
		if (!session?.user) {
			return { ok: false, status: 401, error: "Unauthorized" };
		}
		if ((session.user as { role?: string }).role !== "student") {
			return { ok: false, status: 403, error: "Forbidden" };
		}

		if (!Types.ObjectId.isValid(enrollmentId)) {
			return { ok: false, status: 404, error: "Enrollment not found" };
		}

		const userId = session.user.id;

		await connectDB();
		const e = await Enrollment.findOne({
			_id: enrollmentId,
			userId,
		})
			.populate("programId", "title description paymentInstruction status coverImageUrl")
			.populate("sessionId", "title year")
			.lean();

		if (!e) {
			return { ok: false, status: 404, error: "Enrollment not found" };
		}

		const program = mapProgram(e.programId);
		const programMongoId =
			program?._id ??
			(e.programId && typeof e.programId === "object" && "_id" in e.programId
				? String((e.programId as { _id: unknown })._id)
				: String(e.programId));

		const paymentCodeDocs = await PaymentCode.find({
			userId,
			programId: programMongoId,
		} as unknown as Parameters<typeof PaymentCode.find>[0])
			.sort({ createdAt: -1 })
			.lean();

		const paymentCodes: StudentPaymentCodeRow[] = paymentCodeDocs.map((pc) => ({
			_id: String(pc._id),
			code: pc.code,
			type: pc.type,
			used: pc.used,
			amount: pc.amount,
			partIndex: pc.partIndex,
			createdAt: pc.createdAt ? new Date(pc.createdAt).toISOString() : undefined,
		}));

		return {
			ok: true,
			enrollment: {
				_id: String(e._id),
				source: e.source,
				profileApproved: e.profileApproved,
				programApproved: e.programApproved,
				paymentApproved: e.paymentApproved,
				completedAt: e.completedAt ? new Date(e.completedAt).toISOString() : undefined,
				createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : undefined,
				updatedAt: e.updatedAt ? new Date(e.updatedAt).toISOString() : undefined,
				program,
				session: mapSession(e.sessionId),
				paymentCodes,
			},
		};
	} catch (error) {
		console.error("Error loading enrollment for student:", error);
		return { ok: false, status: 500, error: "Failed to load enrollment" };
	}
}
