"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 15;

interface SessionStudentsManagerProps {
	sessionId: string;
	initialMembershipUserIds: string[];
	enrollments: {
		_id: string;
		userId: string;
		userName: string;
		programApproved: boolean;
	}[];
}

async function fetchSession(sessionId: string) {
	const res = await fetch(`/api/admin/sessions/${sessionId}`);
	if (!res.ok) throw new Error("Failed to fetch session");
	return res.json();
}

export default function SessionStudentsManager({
	sessionId,
	initialMembershipUserIds,
	enrollments,
}: SessionStudentsManagerProps) {
	const queryClient = useQueryClient();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(
		new Set(initialMembershipUserIds)
	);
	const [page, setPage] = useState(1);
	const [qInput, setQInput] = useState("");
	const [debouncedQ, setDebouncedQ] = useState("");
	const [approvedFilter, setApprovedFilter] = useState<"" | "yes" | "no">("");
	const [inSessionFilter, setInSessionFilter] = useState<"" | "yes" | "no">("");

	useEffect(() => {
		const t = setTimeout(() => setDebouncedQ(qInput.trim()), 400);
		return () => clearTimeout(t);
	}, [qInput]);

	useEffect(() => {
		setPage(1);
	}, [debouncedQ, approvedFilter, inSessionFilter]);

	const { data: session } = useQuery({
		queryKey: ["session", sessionId],
		queryFn: () => fetchSession(sessionId),
		initialData: { membershipUserIds: initialMembershipUserIds },
	});

	const membershipUserIds: string[] =
		session?.membershipUserIds ?? initialMembershipUserIds;

	const updateMutation = useMutation({
		mutationFn: async (studentIds: string[]) => {
			const res = await fetch(`/api/admin/sessions/${sessionId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ studentIds }),
			});
			if (!res.ok) {
				const d = (await res.json()) as { error?: string };
				throw new Error(d.error ?? "Failed to update");
			}
			return res.json();
		},
		onSuccess: (data: { membershipUserIds?: string[] }) => {
			queryClient.setQueryData(["session", sessionId], data);
			if (Array.isArray(data.membershipUserIds)) {
				setSelectedIds(new Set(data.membershipUserIds));
			}
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
		selectedIds.size !== membershipUserIds.length ||
		membershipUserIds.some((id: string) => !selectedIds.has(id)) ||
		Array.from(selectedIds).some((id) => !membershipUserIds.includes(id));

	const filteredEnrollments = useMemo(() => {
		const q = debouncedQ.toLowerCase();
		return enrollments.filter((e) => {
			if (q) {
				const name = e.userName.toLowerCase();
				const uid = e.userId.toLowerCase();
				if (!name.includes(q) && !uid.includes(q)) return false;
			}
			if (approvedFilter === "yes" && !e.programApproved) return false;
			if (approvedFilter === "no" && e.programApproved) return false;
			if (inSessionFilter === "yes" && !selectedIds.has(e.userId)) return false;
			if (inSessionFilter === "no" && selectedIds.has(e.userId)) return false;
			return true;
		});
	}, [enrollments, debouncedQ, approvedFilter, inSessionFilter, selectedIds]);

	const totalFiltered = filteredEnrollments.length;
	const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);

	useEffect(() => {
		const tp = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
		setPage((p) => (p > tp ? tp : p));
	}, [totalFiltered]);

	const paginatedEnrollments = useMemo(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filteredEnrollments.slice(start, start + PAGE_SIZE);
	}, [filteredEnrollments, safePage]);

	const hasActiveFilters = Boolean(debouncedQ || approvedFilter || inSessionFilter);

	return (
		<div>
			<Link href="/admin/sessions" className="btn btn-ghost gap-2 mb-4">
				<ArrowLeft className="w-4 h-4" />
				Back to Sessions
			</Link>

			<p className="text-sm text-base-content/70 mb-4">
				Select students enrolled in this program to add them to this session.
			</p>

			{enrollments.length > 0 && (
				<div className="flex flex-wrap items-end gap-3 mb-4">
					<div className="form-control flex-1 min-w-[200px] max-w-md">
						<label className="label py-1">
							<span className="label-text text-xs">Search</span>
						</label>
						<input
							type="search"
							className="input input-bordered input-sm w-full"
							placeholder="Name or user ID"
							value={qInput}
							onChange={(e) => setQInput(e.target.value)}
						/>
					</div>
					<div className="form-control min-w-[180px]">
						<label className="label py-1">
							<span className="label-text text-xs">Program approved</span>
						</label>
						<select
							className="select select-bordered select-sm w-full max-w-xs"
							value={approvedFilter}
							onChange={(e) => setApprovedFilter(e.target.value as "" | "yes" | "no")}
						>
							<option value="">All</option>
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select>
					</div>
					<div className="form-control min-w-[180px]">
						<label className="label py-1">
							<span className="label-text text-xs">In this session</span>
						</label>
						<select
							className="select select-bordered select-sm w-full max-w-xs"
							value={inSessionFilter}
							onChange={(e) => setInSessionFilter(e.target.value as "" | "yes" | "no")}
						>
							<option value="">All</option>
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select>
					</div>
				</div>
			)}

			<div className="overflow-x-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							<th>In session</th>
							<th>Name</th>
							<th>User ID</th>
							<th>Approved</th>
						</tr>
					</thead>
					<tbody>
						{paginatedEnrollments.map((e) => (
							<tr key={e._id}>
								<td>
									<input
										type="checkbox"
										className="checkbox"
										checked={selectedIds.has(e.userId)}
										onChange={() => toggle(e.userId)}
									/>
								</td>
								<td>{e.userName}</td>
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

			{enrollments.length > 0 && totalFiltered === 0 && (
				<div className="alert alert-info mt-4">
					<span>No enrollments match the current filters.</span>
				</div>
			)}

			{totalFiltered > 0 && (
				<div className="flex flex-wrap items-center justify-between gap-2 pt-2">
					<p className="text-sm text-base-content/70">
						{totalFiltered} enrollment{totalFiltered === 1 ? "" : "s"}
						{hasActiveFilters ? " (filtered)" : ""} · Page {safePage} of {totalPages}
					</p>
					<div className="join">
						<button
							type="button"
							className="join-item btn btn-sm"
							disabled={safePage <= 1}
							onClick={() => setPage(Math.max(1, safePage - 1))}
						>
							Previous
						</button>
						<button
							type="button"
							className="join-item btn btn-sm"
							disabled={safePage >= totalPages}
							onClick={() => setPage(Math.min(totalPages, safePage + 1))}
						>
							Next
						</button>
					</div>
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
						onClick={() => setSelectedIds(new Set(membershipUserIds))}
					>
						Reset
					</button>
				</div>
			)}
		</div>
	);
}
