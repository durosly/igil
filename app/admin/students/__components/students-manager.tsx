"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
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

export type StudentsListPayload = {
	students: Student[];
	total: number;
	page: number;
	pageSize: number;
};

interface StudentsManagerProps {
	initialPayload: StudentsListPayload;
	programs: Program[];
}

export default function StudentsManager({ initialPayload, programs }: StudentsManagerProps) {
	const queryClient = useQueryClient();
	const [showModal, setShowModal] = useState(false);
	const [page, setPage] = useState(initialPayload.page);
	const [programId, setProgramId] = useState("");
	const [profileFilter, setProfileFilter] = useState<"" | "yes" | "no">("");
	const [qInput, setQInput] = useState("");
	const [debouncedQ, setDebouncedQ] = useState("");

	const [form, setForm] = useState({
		email: "",
		name: "",
		password: "",
		programId: "",
		sessionId: "",
		sendInvite: true,
		programName: "",
	});

	useEffect(() => {
		const t = setTimeout(() => setDebouncedQ(qInput.trim()), 400);
		return () => clearTimeout(t);
	}, [qInput]);

	useEffect(() => {
		setPage(1);
	}, [programId, profileFilter, debouncedQ]);

	const pageSize = initialPayload.pageSize;

	const isInitialQuery =
		page === initialPayload.page &&
		programId === "" &&
		profileFilter === "" &&
		debouncedQ === "";

	const { data } = useQuery({
		queryKey: ["admin-students", page, pageSize, programId, profileFilter, debouncedQ],
		queryFn: async () => {
			const { data: payload } = await axios.get<StudentsListPayload>("/api/admin/students", {
				params: {
					page,
					pageSize,
					...(debouncedQ ? { q: debouncedQ } : {}),
					...(profileFilter ? { profileApproved: profileFilter } : {}),
					...(programId ? { programId } : {}),
				},
			});
			return payload;
		},
		initialData: isInitialQuery ? initialPayload : undefined,
		placeholderData: (previousData) => previousData,
	});

	const payload =
		data ??
		(isInitialQuery ? initialPayload : { students: [], total: 0, page, pageSize });

	const students = payload.students;
	const total = payload.total;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const hasActiveFilters = Boolean(debouncedQ || programId || profileFilter);

	const createMutation = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data: created } = await axios.post("/api/admin/students", body);
			return created;
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
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Failed to create student");
		},
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
		<div className="space-y-4">
			<div className="flex justify-end">
				<button
					type="button"
					onClick={() => setShowModal(true)}
					className="btn btn-primary gap-2"
				>
					<Plus className="w-5 h-5" />
					Create Student
				</button>
			</div>

			<div className="flex flex-wrap items-end gap-3">
				<div className="form-control flex-1 min-w-[200px] max-w-md">
					<label className="label py-1">
						<span className="label-text text-xs">Search</span>
					</label>
					<input
						type="search"
						className="input input-bordered input-sm w-full"
						placeholder="Name or email"
						value={qInput}
						onChange={(e) => setQInput(e.target.value)}
					/>
				</div>
				<div className="form-control min-w-[200px]">
					<label className="label py-1">
						<span className="label-text text-xs">Enrolled in program</span>
					</label>
					<select
						className="select select-bordered select-sm w-full max-w-xs"
						value={programId}
						onChange={(e) => setProgramId(e.target.value)}
					>
						<option value="">Any program</option>
						{programs.map((p) => (
							<option key={p._id} value={p._id}>
								{p.title}
							</option>
						))}
					</select>
				</div>
				<div className="form-control min-w-[180px]">
					<label className="label py-1">
						<span className="label-text text-xs">Profile approved</span>
					</label>
					<select
						className="select select-bordered select-sm w-full max-w-xs"
						value={profileFilter}
						onChange={(e) => setProfileFilter(e.target.value as "" | "yes" | "no")}
					>
						<option value="">All</option>
						<option value="yes">Yes</option>
						<option value="no">No</option>
					</select>
				</div>
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
								<td>
									<Link href={`/admin/students/${s.id}`} className="link link-primary">
										{s.name ?? "—"}
									</Link>
								</td>
								<td>
									{s.email ? (
										<Link href={`/admin/students/${s.id}`} className="link link-hover">
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

			{total > 0 && (
				<div className="flex flex-wrap items-center justify-between gap-2 pt-2">
					<p className="text-sm text-base-content/70">
						{total} student{total === 1 ? "" : "s"} · Page {page} of {totalPages}
					</p>
					<div className="join">
						<button
							type="button"
							className="join-item btn btn-sm"
							disabled={page <= 1}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
						>
							Previous
						</button>
						<button
							type="button"
							className="join-item btn btn-sm"
							disabled={page >= totalPages}
							onClick={() => setPage((p) => p + 1)}
						>
							Next
						</button>
					</div>
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
