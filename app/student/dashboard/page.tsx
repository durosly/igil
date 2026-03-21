import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import PaymentCode from "@/models/PaymentCode";
import Program from "@/models/Program";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import StudentDashboardClient from "./__components/student-dashboard-client";

export const metadata: Metadata = {
	title: "Student Dashboard",
	description: "Your dashboard",
};

export default async function StudentDashboardPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const userId = session!.user!.id;

	await connectDB();
	const [enrollments, paymentCodes, programs] = await Promise.all([
		Enrollment.find({ userId })
			.populate("programId", "title paymentInstruction status")
			.populate("sessionId", "title year")
			.lean(),
		PaymentCode.find({ userId }).populate("programId", "title").lean(),
		Program.find({ status: "active" }).select("_id title").lean(),
	]);

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Dashboard</h1>
			<StudentDashboardClient
				enrollments={JSON.parse(JSON.stringify(enrollments))}
				paymentCodes={JSON.parse(JSON.stringify(paymentCodes))}
				programs={JSON.parse(JSON.stringify(programs))}
			/>
		</div>
	);
}
