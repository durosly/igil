"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { getProgramTitle, type Session } from "./session-types";

interface SessionsTableProps {
	sessions: Session[];
}

export default function SessionsTable({ sessions }: SessionsTableProps) {
	return (
		<div>
			<div className="overflow-x-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							<th>Program</th>
							<th>Year</th>
							<th>Title</th>
							<th>Students</th>
						</tr>
					</thead>
					<tbody>
						{sessions.map((s) => (
							<tr key={s._id}>
								<td>{getProgramTitle(s)}</td>
								<td>{s.year}</td>
								<td>{s.title}</td>
								<td>{s.studentCount ?? 0}</td>
								<td>
									<Link
										href={`/admin/sessions/${s._id}`}
										className="btn btn-sm btn-ghost gap-1"
									>
										<Pencil className="w-4 h-4" />
										Manage
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{sessions.length === 0 && (
				<div className="alert alert-info mt-4">
					<span>No sessions yet. Create a session to assign students to a program batch.</span>
				</div>
			)}
		</div>
	);
}
