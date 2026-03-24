import "server-only";

import { Types } from "mongoose";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export type AdminEnrollmentListItem = {
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
};

/** Same cap as list-students / list-enrollments user resolution. */
const STUDENT_USER_LIST_LIMIT = 500;

export type ListEnrollmentsForAdminOptions = {
	page?: number;
	pageSize?: number;
	programId?: string;
	/** Program session ObjectId string, or `"none"` for enrollments with no session */
	sessionId?: string;
	source?: string;
	q?: string;
};

export type ListEnrollmentsForAdminResult =
	| { ok: true; enrollments: AdminEnrollmentListItem[]; total: number; page: number; pageSize: number }
	| { ok: false; status: 401 | 403 | 500; error: string };

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

function mapRow(
	e: {
		_id: unknown;
		userId: string;
		programId: unknown;
		sessionId?: unknown;
		source: string;
		profileApproved: boolean;
		programApproved: boolean;
		paymentApproved: boolean;
		createdAt?: Date;
	},
	byUserId: Map<string, { name?: string; email?: string }>
): AdminEnrollmentListItem {
	const prof = byUserId.get(e.userId);
	const prog = programTitle(e.programId);
	const sess = sessionLabel(e.sessionId);
	return {
		_id: String(e._id),
		userId: e.userId,
		studentName: prof?.name,
		studentEmail: prof?.email,
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

export async function listEnrollmentsForAdmin(
	requestHeaders: Headers,
	options: ListEnrollmentsForAdminOptions = {}
): Promise<ListEnrollmentsForAdminResult> {
	try {
		const session = await auth.api.getSession({ headers: requestHeaders });
		if (!session?.user) {
			return { ok: false, status: 401, error: "Unauthorized" };
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return { ok: false, status: 403, error: "Forbidden" };
		}

		const page = Math.max(1, Math.floor(options.page ?? 1));
		const pageSize = Math.min(100, Math.max(1, Math.floor(options.pageSize ?? 20)));

		const listResponse = await auth.api.listUsers({
			query: {
				filterField: "role",
				filterValue: "student",
				filterOperator: "eq",
				limit: STUDENT_USER_LIST_LIMIT,
			},
			headers: requestHeaders,
		});

		const users = listResponse.users ?? [];
		const byUserId = new Map<string, { name?: string; email?: string }>();
		for (const u of users) {
			byUserId.set(u.id, { name: u.name, email: u.email });
		}

		const mongoFilter: Record<string, unknown> = {};
		if (options.programId && Types.ObjectId.isValid(options.programId)) {
			mongoFilter.programId = new Types.ObjectId(options.programId);
		}
		if (options.sessionId === "none") {
			mongoFilter.sessionId = null;
		} else if (options.sessionId && Types.ObjectId.isValid(options.sessionId)) {
			mongoFilter.sessionId = new Types.ObjectId(options.sessionId);
		}
		if (options.source === "invited" || options.source === "self") {
			mongoFilter.source = options.source;
		}

		const q = options.q?.trim().toLowerCase();
		if (q) {
			const matchingUserIds = users
				.filter(
					(u) =>
						(u.name?.toLowerCase().includes(q) ?? false) ||
						(u.email?.toLowerCase().includes(q) ?? false)
				)
				.map((u) => u.id);
			if (matchingUserIds.length === 0) {
				return { ok: true, enrollments: [], total: 0, page, pageSize };
			}
			mongoFilter.userId = { $in: matchingUserIds };
		}

		await connectDB();
		const total = await Enrollment.countDocuments(mongoFilter);
		const rows = await Enrollment.find(mongoFilter)
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.sort({ createdAt: -1 })
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.lean();

		const enrollments: AdminEnrollmentListItem[] = rows.map((e) => mapRow(e, byUserId));

		return { ok: true, enrollments, total, page, pageSize };
	} catch (error) {
		console.error("Error listing enrollments:", error);
		return { ok: false, status: 500, error: "Failed to list enrollments" };
	}
}
