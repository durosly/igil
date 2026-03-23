import "server-only";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";

/** Plain shape passed to the admin students UI (matches `Student` / `Enrollment` in students-manager). */
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

export type ListStudentsForAdminResult =
	| { ok: true; students: AdminStudentListItem[] }
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

export async function listStudentsForAdmin(requestHeaders: Headers): Promise<ListStudentsForAdminResult> {
	try {
		const session = await auth.api.getSession({ headers: requestHeaders });
		if (!session?.user) {
			return { ok: false, status: 401, error: "Unauthorized" };
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return { ok: false, status: 403, error: "Forbidden" };
		}

		const listResponse = await auth.api.listUsers({
			query: {
				filterField: "role",
				filterValue: "student",
				filterOperator: "eq",
				limit: 500,
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

		const students: AdminStudentListItem[] = users.map((u) => ({
			id: u.id,
			name: u.name,
			email: u.email,
			role: u.role,
			profileApproved: (u as { profileApproved?: boolean }).profileApproved,
			enrollments: serializeEnrollments(byUser.get(u.id) ?? []),
		}));

		return { ok: true, students };
	} catch (error) {
		console.error("Error listing students:", error);
		return { ok: false, status: 500, error: "Failed to list students" };
	}
}
