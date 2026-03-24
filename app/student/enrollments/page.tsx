import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Program from "@/models/Program";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { listEnrollmentsForStudent } from "@/lib/student/list-enrollments-for-student";
import StudentEnrollmentsManager from "./__components/student-enrollments-manager";

export const metadata: Metadata = {
	title: "My enrollments",
	description: "View your program enrollments and payment information",
};

const DEFAULT_PAGE_SIZE = 20;

export default async function StudentEnrollmentsPage() {
	const h = await headers();
	const session = await auth.api.getSession({ headers: h });
	const userId = session!.user!.id;

	const listResult = await listEnrollmentsForStudent(h, {
		page: 1,
		pageSize: DEFAULT_PAGE_SIZE,
	});
	if (!listResult.ok) {
		throw new Error(listResult.error);
	}

	await connectDB();
	const programIds = await Enrollment.distinct("programId", { userId });
	const programIdStrings = programIds.map((id) => String(id));
	const programs =
		programIdStrings.length > 0
			? await Program.find({ _id: { $in: programIdStrings } })
					.select("title")
					.sort({ title: 1 })
					.lean()
			: [];

	const initialPayload = {
		enrollments: listResult.enrollments,
		total: listResult.total,
		page: listResult.page,
		pageSize: listResult.pageSize,
	};

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">My enrollments</h1>
			<StudentEnrollmentsManager
				initialPayload={JSON.parse(JSON.stringify(initialPayload))}
				programs={JSON.parse(JSON.stringify(programs))}
			/>
		</div>
	);
}
