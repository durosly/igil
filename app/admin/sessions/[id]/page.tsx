import type { Metadata } from "next";
import connectDB, { getClient } from "@/lib/db";
import {
	betterAuthUserDocumentId,
	betterAuthUserIdFilter,
} from "@/lib/admin/better-auth-user-filter";
import { getSessionDeletionImpactForAdmin } from "@/lib/admin/program-session-deletion";
import ProgramSession from "@/models/ProgramSession";
import Enrollment from "@/models/Enrollment";
import type { IEnrollment } from "@/models/Enrollment";
import { Types } from "mongoose";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import SessionStudentsManager from "../__components/session-students-manager";
import DeleteSessionButton from "./__components/delete-session-button";

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

	const rawProgramId = session.programId;
	const programId =
		typeof rawProgramId === "object" &&
		rawProgramId !== null &&
		"_id" in rawProgramId
			? String((rawProgramId as { _id: unknown })._id)
			: String(rawProgramId);

	const programObjectId = new Types.ObjectId(programId);
	const sessionObjectId = new Types.ObjectId(id);

	const enrollments = await Enrollment.find({
		programId: programObjectId as unknown as IEnrollment["programId"],
		$or: [
			{
				sessionId: sessionObjectId as unknown as NonNullable<
					IEnrollment["sessionId"]
				>,
			},
			{ sessionId: null },
		],
	}).lean();

	const uniqueUserIds = [...new Set(enrollments.map((e) => e.userId))];
	const db = await getClient();
	const userDocs =
		uniqueUserIds.length > 0
			? await db
					.collection("user")
					.find({ $or: uniqueUserIds.map((uid) => betterAuthUserIdFilter(uid)) })
					.project<{ id?: string; _id?: unknown; name?: string; email?: string }>({
						name: 1,
						email: 1,
						id: 1,
					})
					.toArray()
			: [];

	const displayNameByUserId = new Map<string, string>();
	for (const doc of userDocs) {
		const label =
			doc.name?.trim() || doc.email?.trim() || "—";
		const resolved = betterAuthUserDocumentId(doc);
		if (resolved) displayNameByUserId.set(resolved, label);
		if (typeof doc.id === "string" && doc.id) displayNameByUserId.set(doc.id, label);
	}

	const programTitle =
		typeof session.programId === "object" &&
		session.programId !== null &&
		"title" in session.programId
			? String((session.programId as { title: unknown }).title)
			: "Program";

	const initialMembershipUserIds = (await Enrollment.distinct("userId", {
		programId: programObjectId as unknown as IEnrollment["programId"],
		sessionId: sessionObjectId as unknown as NonNullable<IEnrollment["sessionId"]>,
	} as never)) as string[];

	const headersList = await headers();
	const deletion = await getSessionDeletionImpactForAdmin(headersList, id);
	if (!deletion.ok) {
		if (deletion.status === 401) redirect("/login");
		if (deletion.status === 403) redirect("/");
		if (deletion.status === 404) notFound();
		throw new Error(deletion.error);
	}
	const deletionImpact = JSON.parse(JSON.stringify(deletion.impact));

	return (
		<div>
			<div className="flex flex-wrap items-start justify-between gap-4 mb-2">
				<div>
					<h1 className="text-4xl font-bold mb-2">
						{programTitle} – {session.title}
					</h1>
					<p className="text-base-content/70 mb-6">Year: {session.year}</p>
				</div>
				<DeleteSessionButton sessionId={String(session._id)} impact={deletionImpact} />
			</div>
			<SessionStudentsManager
				sessionId={String(session._id)}
				initialMembershipUserIds={initialMembershipUserIds}
				enrollments={enrollments.map((e) => ({
					_id: String(e._id),
					userId: e.userId,
					userName: displayNameByUserId.get(e.userId) ?? "—",
					programApproved: e.programApproved,
				}))}
			/>
		</div>
	);
}
