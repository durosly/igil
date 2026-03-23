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
	const result = await listStudentsForAdmin(headersList);
	if (!result.ok) {
		if (result.status === 401) redirect("/login");
		if (result.status === 403) redirect("/");
		throw new Error(result.error);
	}
	const students = result.students;
	const programs = await Program.find().select("_id title").sort({ title: 1 }).lean();

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Students</h1>
			<StudentsManager initialStudents={students} programs={programs} />
		</div>
	);
}
