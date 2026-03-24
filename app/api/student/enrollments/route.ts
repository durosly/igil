import { NextRequest, NextResponse } from "next/server";
import { listEnrollmentsForStudent } from "@/lib/student/list-enrollments-for-student";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const page = searchParams.get("page");
	const pageSize = searchParams.get("pageSize");
	const programId = searchParams.get("programId") ?? undefined;
	const rawSource = searchParams.get("source");
	const source =
		rawSource === "invited" || rawSource === "self" ? rawSource : undefined;
	const q = searchParams.get("q") ?? undefined;

	const result = await listEnrollmentsForStudent(request.headers, {
		page: page ? Number(page) : undefined,
		pageSize: pageSize ? Number(pageSize) : undefined,
		programId: programId || undefined,
		source,
		q: q || undefined,
	});
	if (!result.ok) {
		return NextResponse.json({ error: result.error }, { status: result.status });
	}
	return NextResponse.json({
		enrollments: result.enrollments,
		total: result.total,
		page: result.page,
		pageSize: result.pageSize,
	});
}
