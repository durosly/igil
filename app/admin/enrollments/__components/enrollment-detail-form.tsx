"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type EnrollmentDetailInitial = {
	userId: string;
	studentName?: string;
	studentEmail?: string;
	programTitle: string;
	source: string;
	createdAt?: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
};

type SessionOption = { _id: string; label: string };

function pipelineSummary(
	profileApproved: boolean,
	programApproved: boolean,
	paymentApproved: boolean
): string {
	if (!profileApproved) return "Waiting for profile approval";
	if (!programApproved) return "Waiting for program approval";
	if (!paymentApproved) return "Payment pending";
	return "Fully approved";
}

export default function EnrollmentDetailForm({
	enrollmentId,
	initial,
	sessions,
}: {
	enrollmentId: string;
	initial: EnrollmentDetailInitial;
	sessions: SessionOption[];
}) {
	const queryClient = useQueryClient();
	const [programApproved, setProgramApproved] = useState(initial.programApproved);
	const [paymentApproved, setPaymentApproved] = useState(initial.paymentApproved);
	const [sessionId, setSessionId] = useState(initial.sessionId ?? "");

	const patchMutation = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data } = await axios.patch(`/api/admin/enrollments/${enrollmentId}`, body);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
			toast.success("Enrollment updated");
		},
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Update failed");
		},
	});

	const busy = patchMutation.isPending;

	const patchProgram = (checked: boolean) => {
		const prev = programApproved;
		setProgramApproved(checked);
		patchMutation.mutate(
			{ programApproved: checked },
			{ onError: () => setProgramApproved(prev) }
		);
	};

	const patchPayment = (checked: boolean) => {
		const prev = paymentApproved;
		setPaymentApproved(checked);
		patchMutation.mutate(
			{ paymentApproved: checked },
			{ onError: () => setPaymentApproved(prev) }
		);
	};

	const patchSession = (value: string) => {
		const prev = sessionId;
		setSessionId(value);
		patchMutation.mutate(
			{ sessionId: value || "" },
			{ onError: () => setSessionId(prev) }
		);
	};

	return (
		<div className="max-w-2xl space-y-8">
			<div className="alert">
				<span className="text-sm">
					{pipelineSummary(initial.profileApproved, programApproved, paymentApproved)}
				</span>
			</div>

			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Student</h2>
				<p>
					<Link href={`/admin/students/${initial.userId}`} className="link link-primary">
						{initial.studentName ?? initial.studentEmail ?? initial.userId}
					</Link>
				</p>
				{initial.studentEmail && initial.studentName && (
					<p className="text-sm text-base-content/70">{initial.studentEmail}</p>
				)}
			</section>

			<section className="space-y-2 text-sm">
				<h2 className="text-xl font-semibold">Enrollment</h2>
				<dl className="grid gap-2">
					<div>
						<dt className="text-base-content/60">Program</dt>
						<dd className="font-medium">{initial.programTitle}</dd>
					</div>
					<div>
						<dt className="text-base-content/60">Source</dt>
						<dd>{initial.source}</dd>
					</div>
					<div>
						<dt className="text-base-content/60">Created</dt>
						<dd>
							{initial.createdAt ? format(new Date(initial.createdAt), "PPp") : "—"}
						</dd>
					</div>
					<div>
						<dt className="text-base-content/60">Profile approved</dt>
						<dd>{initial.profileApproved ? "Yes" : "No"}</dd>
					</div>
				</dl>
			</section>

			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Approvals</h2>
				<label className="label cursor-pointer justify-start gap-3 w-fit">
					<input
						type="checkbox"
						className="checkbox checkbox-primary"
						checked={programApproved}
						disabled={busy}
						onChange={(ev) => patchProgram(ev.target.checked)}
					/>
					<span className="label-text">Program approved</span>
				</label>
				<label className="label cursor-pointer justify-start gap-3 w-fit">
					<input
						type="checkbox"
						className="checkbox checkbox-primary"
						checked={paymentApproved}
						disabled={busy}
						onChange={(ev) => patchPayment(ev.target.checked)}
					/>
					<span className="label-text">Payment approved</span>
				</label>
			</section>

			<section className="space-y-2 max-w-md">
				<h2 className="text-xl font-semibold">Session</h2>
				<select
					className="select select-bordered w-full"
					value={sessionId}
					disabled={busy}
					onChange={(ev) => patchSession(ev.target.value)}
				>
					<option value="">No session</option>
					{sessions.map((s) => (
						<option key={s._id} value={s._id}>
							{s.label}
						</option>
					))}
				</select>
			</section>
		</div>
	);
}
