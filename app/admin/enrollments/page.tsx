import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Program from "@/models/Program";
import ProgramSession from "@/models/ProgramSession";
import { listEnrollmentsForAdmin } from "@/lib/admin/list-enrollments-for-admin";
import EnrollmentsManager from "./__components/enrollments-manager";

export const metadata: Metadata = {
	title: "Enrollments",
	description: "Manage student enrollments",
};

export default async function AdminEnrollmentsPage() {
	await connectDB();
	const headersList = await headers();
	const result = await listEnrollmentsForAdmin(headersList, { page: 1, pageSize: 20 });
	if (!result.ok) {
		if (result.status === 401) redirect("/login");
		if (result.status === 403) redirect("/");
		throw new Error(result.error);
	}

	const programsRaw = await Program.find().select("_id title").sort({ title: 1 }).lean();
	const programs = programsRaw.map((p) => ({
		_id: String(p._id),
		title: String(p.title ?? ""),
	}));

	const sessionsRaw = await ProgramSession.find()
		.select("_id title year programId")
		.sort({ year: -1, title: 1 })
		.lean();
	const sessions = sessionsRaw.map((s) => ({
		_id: String(s._id),
		title: String(s.title ?? ""),
		year: s.year,
		programId: String(s.programId),
	}));

	const initialPayload = {
		enrollments: JSON.parse(JSON.stringify(result.enrollments)),
		total: result.total,
		page: result.page,
		pageSize: result.pageSize,
	};

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Enrollments</h1>
			<EnrollmentsManager
				initialPayload={initialPayload}
				programs={programs}
				sessions={sessions}
			/>
		</div>
	);
}
