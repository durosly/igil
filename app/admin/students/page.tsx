import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Program from "@/models/Program";
import { listStudentsForAdmin } from "@/lib/admin/list-students-for-admin";
import StudentsManager from "./__components/students-manager";

export const metadata: Metadata = {
	title: "Students",
	description: "Manage students",
};

export default async function AdminStudentsPage() {
	await connectDB();
	const headersList = await headers();
	const result = await listStudentsForAdmin(headersList, { page: 1, pageSize: 20 });
	if (!result.ok) {
		if (result.status === 401) redirect("/login");
		if (result.status === 403) redirect("/");
		throw new Error(result.error);
	}
	const initialPayload = {
		students: JSON.parse(JSON.stringify(result.students)),
		total: result.total,
		page: result.page,
		pageSize: result.pageSize,
	};
	const programsRaw = await Program.find().select("_id title").sort({ title: 1 }).lean();
	const programs = programsRaw.map((p) => ({
		_id: String(p._id),
		title: String(p.title ?? ""),
	}));

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Students</h1>
			<StudentsManager initialPayload={initialPayload} programs={programs} />
		</div>
	);
}
