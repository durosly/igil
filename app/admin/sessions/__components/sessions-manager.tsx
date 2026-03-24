"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

interface ProgramRef {
	_id: string;
	title: string;
}

interface Session {
	_id: string;
	programId: ProgramRef | string;
	year: number;
	title: string;
	studentCount?: number;
}

interface SessionsManagerProps {
	initialSessions: Session[];
	programs: ProgramRef[];
}

async function fetchSessions(): Promise<Session[]> {
	const res = await fetch("/api/admin/sessions");
	if (!res.ok) throw new Error("Failed to fetch sessions");
	return res.json();
}

export default function SessionsManager({ initialSessions, programs }: SessionsManagerProps) {
	const queryClient = useQueryClient();
	const [showModal, setShowModal] = useState(false);
	const [editing, setEditing] = useState<Session | null>(null);
	const [form, setForm] = useState({ programId: "", year: new Date().getFullYear(), title: "" });

	const { data: sessions = initialSessions } = useQuery({
		queryKey: ["sessions"],
		queryFn: fetchSessions,
		initialData: initialSessions,
	});

	const createMutation = useMutation({
		mutationFn: async (body: { programId: string; year: number; title: string }) => {
			const res = await fetch("/api/admin/sessions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const d = await res.json();
				throw new Error(d.error ?? "Failed to create");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sessions"] });
			setShowModal(false);
			setForm({ programId: "", year: new Date().getFullYear(), title: "" });
			toast.success("Session created");
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const openCreate = () => {
		setEditing(null);
		setForm({
			programId: programs[0]?._id ?? "",
			year: new Date().getFullYear(),
			title: "",
		});
		setShowModal(true);
	};

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.programId || !form.title) {
			toast.error("Program and title are required");
			return;
		}
		createMutation.mutate({
			programId: form.programId,
			year: form.year,
			title: form.title,
		});
	};

	const programTitle = (s: Session) =>
		typeof s.programId === "object" && s.programId !== null
			? (s.programId as ProgramRef).title
			: "Program";

	return (
		<div>
			<div className="flex justify-end mb-4">
				<button type="button" onClick={openCreate} className="btn btn-primary gap-2">
					<Plus className="w-5 h-5" />
					New Session
				</button>
			</div>

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
								<td>{programTitle(s)}</td>
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

			{showModal && (
				<dialog open className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-bold text-lg">New Session</h3>
						<form onSubmit={handleCreate} className="space-y-4 mt-4">
							<div className="form-control">
								<label className="label">
									<span className="label-text">Program</span>
								</label>
								<select
									className="select select-bordered"
									value={form.programId}
									onChange={(e) => setForm((f) => ({ ...f, programId: e.target.value }))}
									required
								>
									<option value="">Select program</option>
									{programs.map((p) => (
										<option key={p._id} value={p._id}>
											{p.title}
										</option>
									))}
								</select>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Year</span>
								</label>
								<input
									type="number"
									className="input input-bordered"
									value={form.year}
									onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value, 10) }))}
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Title</span>
								</label>
								<input
									type="text"
									className="input input-bordered"
									value={form.title}
									onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
									placeholder="e.g. 2025 Spring Batch"
									required
								/>
							</div>
							<div className="modal-action">
								<button
									type="button"
									className="btn"
									onClick={() => setShowModal(false)}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={createMutation.isPending}
								>
									{createMutation.isPending ? "Creating..." : "Create"}
								</button>
							</div>
						</form>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button type="button" onClick={() => setShowModal(false)}>
							close
						</button>
					</form>
				</dialog>
			)}
		</div>
	);
}
