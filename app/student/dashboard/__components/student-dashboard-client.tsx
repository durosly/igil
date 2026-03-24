"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";

interface Enrollment {
	_id: string;
	programId: { _id: string; title: string; paymentInstruction?: string; status: string } | string;
	sessionId?: { title: string; year: number } | string;
	source: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	completedAt?: string;
}

interface PaymentCode {
	_id: string;
	code: string;
	programId: { _id: string; title: string } | string;
	type: string;
	used: boolean;
	createdAt: string;
}

interface StudentDashboardClientProps {
	enrollments: Enrollment[];
	paymentCodes: PaymentCode[];
	programs: { _id: string; title: string }[];
}

type DashboardData = {
	enrollments: Enrollment[];
	paymentCodes: PaymentCode[];
	programs: { _id: string; title: string }[];
};

async function fetchDashboard(): Promise<DashboardData> {
	const res = await fetch("/api/student/dashboard");
	if (!res.ok) throw new Error("Failed to fetch");
	return res.json();
}

function programTitle(p: { title: string } | string) {
	return typeof p === "object" && p !== null ? p.title : "—";
}

export default function StudentDashboardClient({
	enrollments: initialEnrollments,
	paymentCodes: initialCodes,
	programs: initialPrograms,
}: StudentDashboardClientProps) {
	const { data } = useQuery<DashboardData>({
		queryKey: ["student-dashboard"],
		queryFn: fetchDashboard,
		initialData: {
			enrollments: initialEnrollments,
			paymentCodes: initialCodes,
			programs: initialPrograms,
		},
	});

	const enrollments = data.enrollments ?? initialEnrollments;
	const paymentCodes = data.paymentCodes ?? initialCodes;
	const programs = data.programs ?? initialPrograms;

	return (
		<div className="space-y-8">
			<section>
				<div className="flex flex-wrap items-center justify-between gap-2 mb-4">
					<h2 className="text-2xl font-semibold">My enrollments</h2>
					{enrollments.length > 0 && (
						<Link href="/student/enrollments" className="btn btn-outline btn-sm">
							View all enrollments
						</Link>
					)}
				</div>
				{enrollments.length === 0 ? (
					<div className="alert alert-info">
						<span>You have not enrolled in any program yet.</span>
						<Link href="/student/programs" className="btn btn-sm">
							Browse programs
						</Link>
					</div>
				) : (
					<ul className="space-y-2">
						{enrollments.map((e) => (
							<li key={e._id} className="flex flex-wrap items-center gap-2 p-3 bg-base-200 rounded-lg">
								<span className="font-medium">{programTitle(e.programId)}</span>
								{e.sessionId && (
									<span className="text-sm text-base-content/70">
										{typeof e.sessionId === "object" ? `${e.sessionId.title} (${e.sessionId.year})` : ""}
									</span>
								)}
								<span className="badge badge-sm">{e.source}</span>
								{!e.profileApproved && <span className="badge badge-warning badge-sm">Pending profile approval</span>}
								{e.profileApproved && !e.programApproved && (
									<span className="badge badge-warning badge-sm">Pending program approval</span>
								)}
								{e.programApproved && !e.paymentApproved && (
									<span className="badge badge-info badge-sm">Payment required</span>
								)}
								{e.paymentApproved && <span className="badge badge-success badge-sm">Approved</span>}
							</li>
						))}
					</ul>
				)}
			</section>

			{paymentCodes.length > 0 && (
				<section>
					<h2 className="text-2xl font-semibold mb-4">Payment codes</h2>
					<p className="text-sm text-base-content/70 mb-2">
						Include this code in your payment description so we can match your payment.
					</p>
					<div className="overflow-x-auto">
						<table className="table table-zebra table-sm">
							<thead>
								<tr>
									<th>Code</th>
									<th>Program</th>
									<th>Type</th>
									<th>Used</th>
									<th>Created</th>
								</tr>
							</thead>
							<tbody>
								{paymentCodes.map((pc) => (
									<tr key={pc._id}>
										<td className="font-mono">{pc.code}</td>
										<td>{programTitle(pc.programId)}</td>
										<td>{pc.type}</td>
										<td>{pc.used ? "Yes" : "No"}</td>
										<td>{pc.createdAt ? format(new Date(pc.createdAt), "PP") : "—"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)}

			<section>
				<h2 className="text-2xl font-semibold mb-4">Quick links</h2>
				<div className="flex flex-wrap gap-2">
					<Link href="/student/programs" className="btn btn-primary">
						Browse programs
					</Link>
					<Link href="/student/certificates" className="btn btn-outline">
						My certificates
					</Link>
					<Link href="/student/settings" className="btn btn-ghost">
						Settings
					</Link>
				</div>
			</section>
		</div>
	);
}
