import type { Metadata } from "next";
import connectDB from "@/lib/db";
import ProgramSession from "@/models/ProgramSession";
import Enrollment from "@/models/Enrollment";
import { notFound } from "next/navigation";
import SessionStudentsManager from "../__components/session-students-manager";

export const metadata: Metadata = {
	title: "Session Students",
	description: "Manage students in session",
};

export default async function SessionDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await connectDB();
	const { id } = await params;
	const session = await ProgramSession.findById(id).populate("programId", "title").lean();
	if (!session) notFound();

	const programId = typeof session.programId === "object" && session.programId !== null
		? (session.programId as { _id: string })._id
		: String(session.programId);

	const enrollments = await Enrollment.find({
		programId,
		$or: [{ sessionId: id }, { sessionId: null }],
	})
		.lean();

	const programTitle = typeof session.programId === "object" && session.programId !== null
		? (session.programId as { title: string }).title
		: "Program";

	return (
		<div>
			<h1 className="text-4xl font-bold mb-2">
				{programTitle} – {session.title}
			</h1>
			<p className="text-base-content/70 mb-6">Year: {session.year}</p>
			<SessionStudentsManager
				sessionId={String(session._id)}
				programId={programId}
				initialStudentIds={session.studentIds ?? []}
				enrollments={enrollments.map((e) => ({
					_id: String(e._id),
					userId: e.userId,
					programApproved: e.programApproved,
				}))}
			/>
		</div>
	);
}
