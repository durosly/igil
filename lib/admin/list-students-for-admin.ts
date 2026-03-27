import "server-only";

import { Types } from "mongoose";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";

/** Plain shape passed to the admin students UI (matches `Student` / `Enrollment` in students-types). */
export type AdminStudentListItem = {
	id: string;
	name?: string;
	email?: string;
	role?: string;
	profileApproved?: boolean;
	enrollments: {
		_id: string;
		userId: string;
		programId: string;
		sessionId?: string;
		source: string;
		profileApproved: boolean;
		programApproved: boolean;
		paymentApproved: boolean;
	}[];
};

const STUDENT_USER_LIST_LIMIT = 500;

export type ListStudentsForAdminOptions = {
	page?: number;
	pageSize?: number;
	/** Substring match on name or email (case-insensitive). */
	q?: string;
	/** Filter by profile approval. */
	profileApproved?: "yes" | "no";
	/** Student has at least one enrollment in this program (Mongo ObjectId string). */
	programId?: string;
};

export type ListStudentsForAdminResult =
	| { ok: true; students: AdminStudentListItem[]; total: number; page: number; pageSize: number }
	| { ok: false; status: 401 | 403 | 500; error: string };

function serializeEnrollments(
	rows: {
		_id: unknown;
		userId: string;
		programId: unknown;
		sessionId?: unknown;
		source: string;
		profileApproved: boolean;
		programApproved: boolean;
		paymentApproved: boolean;
	}[]
): AdminStudentListItem["enrollments"] {
	return rows.map((e) => ({
		_id: String(e._id),
		userId: e.userId,
		programId: String(e.programId),
		sessionId: e.sessionId != null ? String(e.sessionId) : undefined,
		source: e.source,
		profileApproved: e.profileApproved,
		programApproved: e.programApproved,
		paymentApproved: e.paymentApproved,
	}));
}

export async function listStudentsForAdmin(
	requestHeaders: Headers,
	options: ListStudentsForAdminOptions = {}
): Promise<ListStudentsForAdminResult> {
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

		await connectDB();
		const enrollments = await Enrollment.find().lean();
		const byUser = new Map<string, typeof enrollments>();
		for (const e of enrollments) {
			const list = byUser.get(e.userId) ?? [];
			list.push(e);
			byUser.set(e.userId, list);
		}

		let rows: AdminStudentListItem[] = users.map((u) => ({
			id: u.id,
			name: u.name,
			email: u.email,
			role: u.role,
			profileApproved: (u as { profileApproved?: boolean }).profileApproved,
			enrollments: serializeEnrollments(byUser.get(u.id) ?? []),
		}));

		const q = options.q?.trim().toLowerCase();
		if (q) {
			rows = rows.filter(
				(s) =>
					(s.name?.toLowerCase().includes(q) ?? false) ||
					(s.email?.toLowerCase().includes(q) ?? false)
			);
		}

		if (options.profileApproved === "yes") {
			rows = rows.filter((s) => s.profileApproved === true);
		} else if (options.profileApproved === "no") {
			rows = rows.filter((s) => !s.profileApproved);
		}

		if (options.programId && Types.ObjectId.isValid(options.programId)) {
			const pid = options.programId;
			rows = rows.filter((s) => s.enrollments.some((e) => e.programId === pid));
		}

		const total = rows.length;
		const start = (page - 1) * pageSize;
		const students = rows.slice(start, start + pageSize);

		return { ok: true, students, total, page, pageSize };
	} catch (error) {
		console.error("Error listing students:", error);
		return { ok: false, status: 500, error: "Failed to list students" };
	}
}
