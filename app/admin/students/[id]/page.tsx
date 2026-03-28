import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudentForAdmin } from "@/lib/admin/get-student-for-admin";
import DeleteStudentButton from "./__components/delete-student-button";
import StudentProfileForm from "./__components/student-profile-form";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	return { title: `Student · ${id.slice(0, 8)}…` };
}

export default async function AdminStudentProfilePage({ params }: Props) {
	const { id } = await params;
	const headersList = await headers();
	const result = await getStudentForAdmin(headersList, id);
	if (!result.ok) {
		if (result.status === 401) redirect("/login");
		if (result.status === 403) redirect("/");
		if (result.status === 404) redirect("/admin/students");
		throw new Error(result.error);
	}

	const s = result.student;
	const initial = JSON.parse(
		JSON.stringify({
			id: s.id,
			name: s.name,
			email: s.email,
			profileApproved: s.profileApproved,
			enrollments: s.enrollments.map((e) => ({
				_id: e._id,
				programTitle: e.programTitle,
				sessionLabel: e.sessionLabel,
				source: e.source,
				programApproved: e.programApproved,
				paymentApproved: e.paymentApproved,
			})),
		})
	);

	const deletionImpact = JSON.parse(JSON.stringify(s.deletionImpact));
	const enrollmentsForDelete = s.enrollments.map((e) => ({
		_id: e._id,
		programTitle: e.programTitle,
		sessionLabel: e.sessionLabel,
		source: e.source,
	}));

	return (
		<div>
			<div className="mb-6">
				<Link href="/admin/students" className="link link-hover text-sm">
					← Students
				</Link>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
				<h1 className="text-4xl font-bold">Student profile</h1>
				<DeleteStudentButton
					studentId={s.id}
					studentName={s.name}
					studentEmail={s.email}
					enrollments={enrollmentsForDelete}
					deletionImpact={deletionImpact}
				/>
			</div>
			<StudentProfileForm initial={initial} />
		</div>
	);
}
