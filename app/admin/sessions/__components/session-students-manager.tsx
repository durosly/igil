"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface SessionStudentsManagerProps {
	sessionId: string;
	programId: string;
	initialStudentIds: string[];
	enrollments: { _id: string; userId: string; programApproved: boolean }[];
}

async function fetchSession(sessionId: string) {
	const res = await fetch(`/api/admin/sessions/${sessionId}`);
	if (!res.ok) throw new Error("Failed to fetch session");
	return res.json();
}

export default function SessionStudentsManager({
	sessionId,
	programId,
	initialStudentIds,
	enrollments,
}: SessionStudentsManagerProps) {
	const queryClient = useQueryClient();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialStudentIds));

	const { data: session } = useQuery({
		queryKey: ["session", sessionId],
		queryFn: () => fetchSession(sessionId),
		initialData: { studentIds: initialStudentIds },
	});

	const studentIds = session?.studentIds ?? initialStudentIds;

	const updateMutation = useMutation({
		mutationFn: async (studentIds: string[]) => {
			const res = await fetch(`/api/admin/sessions/${sessionId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ studentIds }),
			});
			if (!res.ok) {
				const d = await res.json();
				throw new Error(d.error ?? "Failed to update");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
			queryClient.invalidateQueries({ queryKey: ["sessions"] });
			toast.success("Session updated");
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const toggle = (userId: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(userId)) next.delete(userId);
			else next.add(userId);
			return next;
		});
	};

	const save = () => {
		updateMutation.mutate(Array.from(selectedIds));
	};

	const hasChanges =
		selectedIds.size !== studentIds.length ||
		studentIds.some((id: string) => !selectedIds.has(id)) ||
		Array.from(selectedIds).some((id) => !studentIds.includes(id));

	return (
		<div>
			<Link href="/admin/sessions" className="btn btn-ghost gap-2 mb-4">
				<ArrowLeft className="w-4 h-4" />
				Back to Sessions
			</Link>

			<p className="text-sm text-base-content/70 mb-4">
				Select students enrolled in this program to add them to this session.
			</p>

			<div className="overflow-x-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							<th>In session</th>
							<th>User ID</th>
							<th>Approved</th>
						</tr>
					</thead>
					<tbody>
						{enrollments.map((e) => (
							<tr key={e._id}>
								<td>
									<input
										type="checkbox"
										className="checkbox"
										checked={selectedIds.has(e.userId)}
										onChange={() => toggle(e.userId)}
									/>
								</td>
								<td className="font-mono text-sm">{e.userId}</td>
								<td>{e.programApproved ? "Yes" : "No"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{enrollments.length === 0 && (
				<div className="alert alert-info">
					<span>No enrollments for this program yet. Assign students to this program first.</span>
				</div>
			)}

			{hasChanges && (
				<div className="mt-4 flex gap-2">
					<button
						type="button"
						className="btn btn-primary"
						onClick={save}
						disabled={updateMutation.isPending}
					>
						{updateMutation.isPending ? "Saving..." : "Save changes"}
					</button>
					<button
						type="button"
						className="btn btn-ghost"
						onClick={() => setSelectedIds(new Set(studentIds))}
					>
						Reset
					</button>
				</div>
			)}
		</div>
	);
}
