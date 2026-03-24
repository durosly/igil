import "server-only";

import { Types } from "mongoose";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Program from "@/models/Program";

export type StudentEnrollmentListItem = {
	_id: string;
	programId: string;
	programTitle: string;
	sessionId?: string;
	sessionLabel?: string;
	source: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	createdAt?: string;
};

export type ListEnrollmentsForStudentOptions = {
	page?: number;
	pageSize?: number;
	programId?: string;
	source?: string;
	q?: string;
};

export type ListEnrollmentsForStudentResult =
	| { ok: true; enrollments: StudentEnrollmentListItem[]; total: number; page: number; pageSize: number }
	| { ok: false; status: 401 | 403 | 500; error: string };

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

function mapRow(e: {
	_id: unknown;
	programId: unknown;
	sessionId?: unknown;
	source: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	createdAt?: Date;
}): StudentEnrollmentListItem {
	const prog = programTitle(e.programId);
	const sess = sessionLabel(e.sessionId);
	return {
		_id: String(e._id),
		programId: prog.id,
		programTitle: prog.title,
		sessionId: sess?.id,
		sessionLabel: sess?.label,
		source: e.source,
		profileApproved: e.profileApproved,
		programApproved: e.programApproved,
		paymentApproved: e.paymentApproved,
		createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : undefined,
	};
}

export async function listEnrollmentsForStudent(
	requestHeaders: Headers,
	options: ListEnrollmentsForStudentOptions = {}
): Promise<ListEnrollmentsForStudentResult> {
	try {
		const session = await auth.api.getSession({ headers: requestHeaders });
		if (!session?.user) {
			return { ok: false, status: 401, error: "Unauthorized" };
		}
		if ((session.user as { role?: string }).role !== "student") {
			return { ok: false, status: 403, error: "Forbidden" };
		}

		const userId = session.user.id;
		const page = Math.max(1, Math.floor(options.page ?? 1));
		const pageSize = Math.min(100, Math.max(1, Math.floor(options.pageSize ?? 20)));

		const mongoFilter: Record<string, unknown> = { userId };

		if (options.source === "invited" || options.source === "self") {
			mongoFilter.source = options.source;
		}

		await connectDB();

		const qTrim = options.q?.trim();
		const selectedPid = options.programId?.trim();
		const selectedProgramValid = selectedPid && Types.ObjectId.isValid(selectedPid);

		if (qTrim) {
			const matchingPrograms = await Program.find({
				title: { $regex: escapeRegex(qTrim), $options: "i" },
			})
				.select("_id")
				.lean();
			const matchingIds = matchingPrograms.map((p) => String(p._id));
			if (matchingIds.length === 0) {
				return { ok: true, enrollments: [], total: 0, page, pageSize };
			}
			if (selectedProgramValid) {
				if (!matchingIds.includes(selectedPid!)) {
					return { ok: true, enrollments: [], total: 0, page, pageSize };
				}
				mongoFilter.programId = selectedPid;
			} else {
				mongoFilter.programId = { $in: matchingIds };
			}
		} else if (selectedProgramValid) {
			mongoFilter.programId = selectedPid;
		}
		const total = await Enrollment.countDocuments(mongoFilter);
		const rows = await Enrollment.find(mongoFilter)
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.sort({ createdAt: -1 })
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.lean();

		const enrollments: StudentEnrollmentListItem[] = rows.map((e) => mapRow(e));

		return { ok: true, enrollments, total, page, pageSize };
	} catch (error) {
		console.error("Error listing enrollments for student:", error);
		return { ok: false, status: 500, error: "Failed to list enrollments" };
	}
}
