export interface Enrollment {
	_id: string;
	userId: string;
	programId: string;
	sessionId?: string;
	source: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
}

export interface Student {
	id: string;
	name?: string;
	email?: string;
	role?: string;
	profileApproved?: boolean;
	enrollments: Enrollment[];
}

export interface Program {
	_id: string;
	title: string;
}

export type StudentsListPayload = {
	students: Student[];
	total: number;
	page: number;
	pageSize: number;
};

export const ADMIN_STUDENTS_QUERY_KEY = "admin-students" as const;

export function adminStudentsQueryKey(
	page: number,
	pageSize: number,
	programId: string,
	profileFilter: string,
	debouncedQ: string
) {
	return [
		ADMIN_STUDENTS_QUERY_KEY,
		page,
		pageSize,
		programId,
		profileFilter,
		debouncedQ,
	] as const;
}
