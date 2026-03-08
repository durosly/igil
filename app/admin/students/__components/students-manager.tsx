"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Enrollment {
	_id: string;
	userId: string;
	programId: string;
	sessionId?: string;
	source: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
}

interface Student {
	id: string;
	name?: string;
	email?: string;
	role?: string;
	profileApproved?: boolean;
	enrollments: Enrollment[];
}

interface Program {
	_id: string;
	title: string;
}

interface StudentsManagerProps {
	initialStudents: Student[];
	programs: Program[];
}

async function fetchStudents(): Promise<Student[]> {
	const res = await fetch("/api/admin/students");
	if (!res.ok) throw new Error("Failed to fetch students");
	return res.json();
}

export default function StudentsManager({ initialStudents, programs }: StudentsManagerProps) {
	const queryClient = useQueryClient();
	const [showModal, setShowModal] = useState(false);
	const [form, setForm] = useState({
		email: "",
		name: "",
		password: "",
		programId: "",
		sessionId: "",
		sendInvite: true,
		programName: "",
	});

	const { data: students = initialStudents } = useQuery({
		queryKey: ["admin-students"],
		queryFn: fetchStudents,
		initialData: initialStudents,
	});

	const createMutation = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const res = await fetch("/api/admin/students", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const d = await res.json();
				throw new Error(d.error ?? "Failed to create student");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-students"] });
			setShowModal(false);
			setForm({
				email: "",
				name: "",
				password: "",
				programId: "",
				sessionId: "",
				sendInvite: true,
				programName: "",
			});
			toast.success("Student created");
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.email || !form.name || !form.password) {
			toast.error("Email, name, and password are required");
			return;
		}
		createMutation.mutate({
			email: form.email.trim(),
			name: form.name.trim(),
			password: form.password,
			programId: form.programId || undefined,
			sessionId: form.sessionId || undefined,
			sendInvite: form.sendInvite,
			programName: form.programName || undefined,
		});
	};

	return (
		<div>
			<div className="flex justify-end mb-4">
				<button
					type="button"
					onClick={() => setShowModal(true)}
					className="btn btn-primary gap-2"
				>
					<Plus className="w-5 h-5" />
					Create Student
				</button>
			</div>

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
								<td>{s.name ?? "—"}</td>
								<td>{s.email ?? "—"}</td>
								<td>{s.profileApproved ? "Yes" : "No"}</td>
								<td>{(s.enrollments?.length ?? 0)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{students.length === 0 && (
				<div className="alert alert-info mt-4">
					<span>No students yet. Create a student or they can sign up themselves.</span>
				</div>
			)}

			{showModal && (
				<dialog open className="modal modal-open">
					<div className="modal-box max-w-md">
						<h3 className="font-bold text-lg">Create Student</h3>
						<form onSubmit={handleCreate} className="space-y-4 mt-4">
							<div className="form-control">
								<label className="label">
									<span className="label-text">Name *</span>
								</label>
								<input
									type="text"
									className="input input-bordered"
									value={form.name}
									onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
									required
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Email *</span>
								</label>
								<input
									type="email"
									className="input input-bordered"
									value={form.email}
									onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
									required
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Temporary password *</span>
								</label>
								<input
									type="text"
									className="input input-bordered"
									value={form.password}
									onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
									required
									minLength={8}
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Assign to program</span>
								</label>
								<select
									className="select select-bordered"
									value={form.programId}
									onChange={(e) => setForm((f) => ({ ...f, programId: e.target.value }))}
								>
									<option value="">None</option>
									{programs.map((p) => (
										<option key={p._id} value={p._id}>
											{p.title}
										</option>
									))}
								</select>
							</div>
							{form.programId && (
								<div className="form-control">
									<label className="label">
										<span className="label-text">Program name (for email)</span>
									</label>
									<input
										type="text"
										className="input input-bordered"
										value={form.programName}
										onChange={(e) => setForm((f) => ({ ...f, programName: e.target.value }))}
										placeholder="e.g. NDT Level 1"
									/>
								</div>
							)}
							<div className="form-control">
								<label className="label cursor-pointer justify-start gap-2">
									<input
										type="checkbox"
										className="checkbox"
										checked={form.sendInvite}
										onChange={(e) => setForm((f) => ({ ...f, sendInvite: e.target.checked }))}
									/>
									<span className="label-text">Send invitation email</span>
								</label>
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
