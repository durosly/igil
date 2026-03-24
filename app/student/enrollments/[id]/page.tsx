import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { headers } from "next/headers";
import { getEnrollmentForStudent } from "@/lib/student/get-enrollment-for-student";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const result = await getEnrollmentForStudent(await headers(), id);
	if (!result.ok) {
		return { title: "Enrollment" };
	}
	return {
		title: result.enrollment.program?.title ?? "Enrollment",
		description: "Enrollment details and payment instructions",
	};
}

export default async function StudentEnrollmentDetailPage({ params }: Props) {
	const { id } = await params;
	const h = await headers();
	const result = await getEnrollmentForStudent(h, id);
	if (!result.ok) {
		if (result.status === 404) notFound();
		throw new Error(result.error);
	}

	const { enrollment: e } = result;
	const program = e.program;

	return (
		<div className="space-y-8 max-w-3xl">
			<div className="flex flex-wrap items-center gap-3">
				<Link href="/student/enrollments" className="btn btn-ghost btn-sm">
					← All enrollments
				</Link>
			</div>

			<div>
				<h1 className="text-4xl font-bold mb-2">{program?.title ?? "Enrollment"}</h1>
				{e.session && (
					<p className="text-base-content/70">
						Session: <span className="text-base-content">{e.session.label}</span>
					</p>
				)}
				<p className="text-sm text-base-content/60 mt-1">
					Source: {e.source}
					{e.createdAt && (
						<>
							{" "}
							· Enrolled {format(new Date(e.createdAt), "PP")}
						</>
					)}
				</p>
			</div>

			{program?.coverImageUrl && (
				<div className="w-full max-w-md aspect-video rounded-lg overflow-hidden bg-base-200">
					<img
						src={program.coverImageUrl}
						alt=""
						className="h-full w-full object-cover"
					/>
				</div>
			)}

			<section className="space-y-2">
				<h2 className="text-xl font-semibold">Status</h2>
				<div className="flex flex-wrap gap-2">
					{!e.profileApproved && (
						<span className="badge badge-warning badge-sm">Pending profile approval</span>
					)}
					{e.profileApproved && !e.programApproved && (
						<span className="badge badge-warning badge-sm">Pending program approval</span>
					)}
					{e.programApproved && !e.paymentApproved && (
						<span className="badge badge-info badge-sm">Payment required</span>
					)}
					{e.paymentApproved && (
						<span className="badge badge-success badge-sm">Payment approved</span>
					)}
					{e.completedAt && (
						<span className="badge badge-ghost badge-sm">
							Completed {format(new Date(e.completedAt), "PP")}
						</span>
					)}
				</div>
			</section>

			{program?.description && (
				<section className="space-y-2">
					<h2 className="text-xl font-semibold">About this program</h2>
					<div className="prose prose-sm max-w-none whitespace-pre-wrap">{program.description}</div>
				</section>
			)}

			<section className="space-y-2">
				<h2 className="text-xl font-semibold">Payment instructions</h2>
				{program?.paymentInstruction ? (
					<div className="rounded-lg bg-base-200 p-4 whitespace-pre-wrap text-sm">
						{program.paymentInstruction}
					</div>
				) : (
					<p className="text-base-content/60 text-sm">
						No payment instructions have been set for this program yet. Contact the office if you need
						help.
					</p>
				)}
			</section>

			{e.paymentCodes.length > 0 && (
				<section className="space-y-2">
					<h2 className="text-xl font-semibold">Your payment codes</h2>
					<p className="text-sm text-base-content/70">
						Include this code in your payment description so we can match your payment.
					</p>
					<div className="overflow-x-auto">
						<table className="table table-zebra table-sm">
							<thead>
								<tr>
									<th>Code</th>
									<th>Type</th>
									<th>Used</th>
									<th>Created</th>
								</tr>
							</thead>
							<tbody>
								{e.paymentCodes.map((pc) => (
									<tr key={pc._id}>
										<td className="font-mono">{pc.code}</td>
										<td>{pc.type}</td>
										<td>{pc.used ? "Yes" : "No"}</td>
										<td>
											{pc.createdAt ? format(new Date(pc.createdAt), "PP") : "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)}

			<div className="flex flex-wrap gap-2 pt-4">
				<Link href="/student/programs" className="btn btn-outline btn-sm">
					Browse programs
				</Link>
			</div>
		</div>
	);
}
