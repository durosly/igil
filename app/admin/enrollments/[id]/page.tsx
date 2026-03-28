import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import { getEnrollmentDeletionImpactForAdmin } from "@/lib/admin/enrollment-deletion";
import { getEnrollmentForAdmin } from "@/lib/admin/get-enrollment-for-admin";
import connectDB from "@/lib/db";
import ProgramSession from "@/models/ProgramSession";
import EnrollmentDetailForm from "../__components/enrollment-detail-form";
import DeleteEnrollmentButton from "./__components/delete-enrollment-button";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	return { title: `Enrollment · ${id.slice(0, 8)}…` };
}

export default async function AdminEnrollmentDetailPage({ params }: Props) {
	const { id } = await params;
	const headersList = await headers();
	const result = await getEnrollmentForAdmin(headersList, id);
	if (!result.ok) {
		if (result.status === 401) redirect("/login");
		if (result.status === 403) redirect("/");
		if (result.status === 404) redirect("/admin/enrollments");
		throw new Error(result.error);
	}

	await connectDB();
	const progId = result.enrollment.programId;
	const programOid = Types.ObjectId.isValid(progId) ? new Types.ObjectId(progId) : null;
	const sessionsRaw = programOid
		? await ProgramSession.find({ programId: programOid } as never)
				.sort({ year: -1 })
				.lean()
		: [];
	const sessions = sessionsRaw.map((s) => ({
		_id: String(s._id),
		label:
			s.title != null && s.year != null ? `${s.title} (${s.year})` : (s.title ?? "—"),
	}));

	const initial = JSON.parse(JSON.stringify(result.enrollment));

	const deletion = await getEnrollmentDeletionImpactForAdmin(headersList, id);
	if (!deletion.ok) {
		if (deletion.status === 401) redirect("/login");
		if (deletion.status === 403) redirect("/");
		if (deletion.status === 404) redirect("/admin/enrollments");
		throw new Error(deletion.error);
	}
	const deletionImpact = JSON.parse(JSON.stringify(deletion.impact));

	return (
		<div>
			<div className="mb-6">
				<Link href="/admin/enrollments" className="link link-hover text-sm">
					← Enrollments
				</Link>
			</div>
			<div className="flex flex-wrap items-start justify-between gap-4 mb-6">
				<h1 className="text-4xl font-bold">Enrollment details</h1>
				<DeleteEnrollmentButton enrollmentId={id} impact={deletionImpact} />
			</div>
			<EnrollmentDetailForm enrollmentId={id} initial={initial} sessions={sessions} />
		</div>
	);
}
