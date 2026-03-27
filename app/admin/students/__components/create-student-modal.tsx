"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { ADMIN_STUDENTS_QUERY_KEY, type Program } from "./students-types";

interface CreateStudentModalProps {
	open: boolean;
	onClose: () => void;
	programs: Program[];
}

const emptyForm = {
	email: "",
	name: "",
	password: "",
	programId: "",
	sessionId: "",
	sendInvite: true,
	programName: "",
};

export function CreateStudentModal({
	open,
	onClose,
	programs,
}: CreateStudentModalProps) {
	const queryClient = useQueryClient();
	const [form, setForm] = useState(emptyForm);

	const createMutation = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data: created } = await axios.post("/api/admin/students", body);
			return created;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ADMIN_STUDENTS_QUERY_KEY] });
			setForm(emptyForm);
			onClose();
			toast.success("Student created");
		},
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Failed to create student");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
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

	const handleClose = () => {
		if (!createMutation.isPending) onClose();
	};

	if (!open) return null;

	return (
		<dialog open className="modal modal-open">
			<div className="modal-box max-w-md">
				<h3 className="font-bold text-lg">Create Student</h3>
				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					<div className="form-control">
						<label className="label">
							<span className="label-text">Name *</span>
						</label>
						<input
							type="text"
							className="input input-bordered"
							value={form.name}
							onChange={(e) =>
								setForm((f) => ({ ...f, name: e.target.value }))
							}
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
							onChange={(e) =>
								setForm((f) => ({ ...f, email: e.target.value }))
							}
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
							onChange={(e) =>
								setForm((f) => ({ ...f, password: e.target.value }))
							}
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
							onChange={(e) =>
								setForm((f) => ({ ...f, programId: e.target.value }))
							}
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
								onChange={(e) =>
									setForm((f) => ({ ...f, programName: e.target.value }))
								}
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
								onChange={(e) =>
									setForm((f) => ({ ...f, sendInvite: e.target.checked }))
								}
							/>
							<span className="label-text">Send invitation email</span>
						</label>
					</div>
					<div className="modal-action">
						<button
							type="button"
							className="btn"
							onClick={handleClose}
							disabled={createMutation.isPending}
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
				<button type="button" onClick={handleClose}>
					close
				</button>
			</form>
		</dialog>
	);
}
