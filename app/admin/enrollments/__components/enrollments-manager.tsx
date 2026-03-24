"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export interface AdminEnrollmentRow {
	_id: string;
	userId: string;
	studentName?: string;
	studentEmail?: string;
	programId: string;
	programTitle: string;
	sessionId?: string;
	sessionLabel?: string;
	source: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	createdAt?: string;
}

export type EnrollmentsListPayload = {
	enrollments: AdminEnrollmentRow[];
	total: number;
	page: number;
	pageSize: number;
};

interface ProgramOption {
	_id: string;
	title: string;
}

interface SessionOption {
	_id: string;
	title: string;
	year: number;
	programId: string;
}

interface EnrollmentsManagerProps {
	initialPayload: EnrollmentsListPayload;
	programs: ProgramOption[];
	sessions: SessionOption[];
}

function OkBadge({ ok }: { ok: boolean }) {
	return ok ? (
		<span className="badge badge-success badge-sm">Yes</span>
	) : (
		<span className="text-base-content/50">—</span>
	);
}

export default function EnrollmentsManager({
	initialPayload,
	programs,
	sessions,
}: EnrollmentsManagerProps) {
	const [page, setPage] = useState(initialPayload.page);
	const [programId, setProgramId] = useState("");
	const [sessionFilter, setSessionFilter] = useState<"" | "none" | string>("");
	const [source, setSource] = useState<"" | "invited" | "self">("");
	const [qInput, setQInput] = useState("");
	const [debouncedQ, setDebouncedQ] = useState("");

	const programTitleById = useMemo(() => {
		const m = new Map<string, string>();
		for (const p of programs) m.set(p._id, p.title);
		return m;
	}, [programs]);

	const sessionOptions = useMemo(() => {
		if (!programId) return sessions;
		return sessions.filter((s) => s.programId === programId);
	}, [sessions, programId]);

	useEffect(() => {
		const t = setTimeout(() => setDebouncedQ(qInput.trim()), 400);
		return () => clearTimeout(t);
	}, [qInput]);

	useEffect(() => {
		setPage(1);
	}, [programId, sessionFilter, source, debouncedQ]);

	useEffect(() => {
		if (!sessionFilter || sessionFilter === "none") return;
		const ok = sessionOptions.some((s) => s._id === sessionFilter);
		if (!ok) setSessionFilter("");
	}, [programId, sessionFilter, sessionOptions]);

	const pageSize = initialPayload.pageSize;

	const isInitialQuery =
		page === initialPayload.page &&
		programId === "" &&
		sessionFilter === "" &&
		source === "" &&
		debouncedQ === "";

	const { data } = useQuery({
		queryKey: [
			"admin-enrollments",
			page,
			pageSize,
			programId,
			sessionFilter,
			source,
			debouncedQ,
		],
		queryFn: async () => {
			const { data: payload } = await axios.get<EnrollmentsListPayload>("/api/admin/enrollments", {
				params: {
					page,
					pageSize,
					...(programId ? { programId } : {}),
					...(sessionFilter === "none"
						? { sessionId: "none" }
						: sessionFilter
							? { sessionId: sessionFilter }
							: {}),
					...(source ? { source } : {}),
					...(debouncedQ ? { q: debouncedQ } : {}),
				},
			});
			return payload;
		},
		initialData: isInitialQuery ? initialPayload : undefined,
		placeholderData: (previousData) => previousData,
	});

	const payload =
		data ??
		(isInitialQuery ? initialPayload : { enrollments: [], total: 0, page, pageSize });

	const enrollments = payload.enrollments;
	const total = payload.total;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-end gap-3">
				<div className="form-control min-w-[200px]">
					<label className="label py-1">
						<span className="label-text text-xs">Program</span>
					</label>
					<select
						className="select select-bordered select-sm w-full max-w-xs"
						value={programId}
						onChange={(e) => setProgramId(e.target.value)}
					>
						<option value="">All programs</option>
						{programs.map((p) => (
							<option key={p._id} value={p._id}>
								{p.title}
							</option>
						))}
					</select>
				</div>
				<div className="form-control min-w-[220px]">
					<label className="label py-1">
						<span className="label-text text-xs">Program session</span>
					</label>
					<select
						className="select select-bordered select-sm w-full max-w-md"
						value={sessionFilter}
						onChange={(e) => setSessionFilter(e.target.value as "" | "none" | string)}
					>
						<option value="">All sessions</option>
						<option value="none">No session</option>
						{sessionOptions.map((s) => {
							const progTitle = programTitleById.get(s.programId);
							const label =
								programId || !progTitle
									? `${s.title} (${s.year})`
									: `${progTitle} — ${s.title} (${s.year})`;
							return (
								<option key={s._id} value={s._id}>
									{label}
								</option>
							);
						})}
					</select>
				</div>
				<div className="form-control min-w-[140px]">
					<label className="label py-1">
						<span className="label-text text-xs">Source</span>
					</label>
					<select
						className="select select-bordered select-sm w-full max-w-xs"
						value={source}
						onChange={(e) => setSource(e.target.value as "" | "invited" | "self")}
					>
						<option value="">All</option>
						<option value="invited">Invited</option>
						<option value="self">Self</option>
					</select>
				</div>
				<div className="form-control flex-1 min-w-[200px] max-w-md">
					<label className="label py-1">
						<span className="label-text text-xs">Search student</span>
					</label>
					<input
						type="search"
						className="input input-bordered input-sm w-full"
						placeholder="Name or email"
						value={qInput}
						onChange={(e) => setQInput(e.target.value)}
					/>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							<th>Student</th>
							<th>Email</th>
							<th>Program</th>
							<th>Session</th>
							<th>Source</th>
							<th>Created</th>
							<th>Profile</th>
							<th>Program</th>
							<th>Payment</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{enrollments.map((e) => (
							<tr key={e._id}>
								<td>
									<Link
										href={`/admin/students/${e.userId}`}
										className="link link-primary"
									>
										{e.studentName ?? "—"}
									</Link>
								</td>
								<td>
									{e.studentEmail ? (
										<Link
											href={`/admin/students/${e.userId}`}
											className="link link-hover text-sm"
										>
											{e.studentEmail}
										</Link>
									) : (
										"—"
									)}
								</td>
								<td>{e.programTitle}</td>
								<td>{e.sessionLabel ?? "—"}</td>
								<td>{e.source}</td>
								<td className="whitespace-nowrap text-sm">
									{e.createdAt ? format(new Date(e.createdAt), "PP") : "—"}
								</td>
								<td>
									<OkBadge ok={e.profileApproved} />
								</td>
								<td>
									<OkBadge ok={e.programApproved} />
								</td>
								<td>
									<OkBadge ok={e.paymentApproved} />
								</td>
								<td>
									<Link href={`/admin/enrollments/${e._id}`} className="btn btn-ghost btn-xs">
										Details
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{enrollments.length === 0 && (
				<div className="alert alert-info">
					<span>No enrollments match the current filters.</span>
				</div>
			)}

			{total > 0 && (
				<div className="flex flex-wrap items-center justify-between gap-2 pt-2">
					<p className="text-sm text-base-content/70">
						{total} enrollment{total === 1 ? "" : "s"} · Page {page} of {totalPages}
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
		</div>
	);
}
