"use client";

import Link from "next/link";
import type { Student } from "./students-types";

interface StudentsTableProps {
	students: Student[];
	hasActiveFilters: boolean;
}

export function StudentsTable({ students, hasActiveFilters }: StudentsTableProps) {
	return (
		<>
			<div className="overflow-x-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Profile approved</th>
							<th>Enrollments</th>
						</tr>
					</thead>
					<tbody>
						{students.map((s) => (
							<tr key={s.id}>
								<td>
									<Link
										href={`/admin/students/${s.id}`}
										className="link link-primary"
									>
										{s.name ?? "—"}
									</Link>
								</td>
								<td>
									{s.email ? (
										<Link
											href={`/admin/students/${s.id}`}
											className="link link-hover"
										>
											{s.email}
										</Link>
									) : (
										"—"
									)}
								</td>
								<td>{s.profileApproved ? "Yes" : "No"}</td>
								<td>{s.enrollments?.length ?? 0}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{students.length === 0 && (
				<div className="alert alert-info mt-4">
					<span>
						{hasActiveFilters
							? "No students match the current filters."
							: "No students yet. Create a student or they can sign up themselves."}
					</span>
				</div>
			)}
		</>
	);
}
