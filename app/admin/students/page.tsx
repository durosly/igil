import type { Metadata } from "next";
import { headers } from "next/headers";
import connectDB from "@/lib/db";
import Program from "@/models/Program";
import StudentsManager from "./__components/students-manager";

export const metadata: Metadata = {
	title: "Students",
	description: "Manage students",
};

export default async function AdminStudentsPage() {
	await connectDB();
	const headersList = await headers();
	const cookie = headersList.get("cookie") ?? "";
	const base = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const students = await fetch(`${base}/api/admin/students`, {
		cache: "no-store",
		headers: { cookie },
	}).then((r) => (r.ok ? r.json() : []));
	const programs = await Program.find().select("_id title").sort({ title: 1 }).lean();

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Students</h1>
			<StudentsManager initialStudents={students} programs={programs} />
		</div>
	);
}
