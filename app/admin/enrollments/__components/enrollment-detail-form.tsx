"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CertificateSummary = {
	_id: string;
	completedAt: string;
	sessionId?: string;
	documentUrl?: string;
	storageKey?: string;
	contentType?: string;
	originalFileName?: string;
	certificateNumber?: string;
	issuedAt?: string;
	downloadCount: number;
	lastUnlockUntil?: string;
};

type EnrollmentDetailInitial = {
	userId: string;
	studentName?: string;
	studentEmail?: string;
	programTitle: string;
	programId: string;
	sessionId?: string;
	sessionLabel?: string;
	source: string;
	createdAt?: string;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	completedAt?: string;
	certificate: CertificateSummary | null;
};

type SessionOption = { _id: string; label: string };

function pipelineSummary(
	profileApproved: boolean,
	programApproved: boolean,
	paymentApproved: boolean,
	completed: boolean
): string {
	if (!profileApproved) return "Waiting for profile approval";
	if (!programApproved) return "Waiting for program approval";
	if (!paymentApproved) return "Payment pending";
	if (!completed) return "Fully approved — not marked complete";
	return "Completed";
}

function isoToDateInput(iso?: string): string {
	if (!iso) return "";
	try {
		return format(new Date(iso), "yyyy-MM-dd");
	} catch {
		return "";
	}
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
	const router = useRouter();
	const queryClient = useQueryClient();
	const [programApproved, setProgramApproved] = useState(initial.programApproved);
	const [paymentApproved, setPaymentApproved] = useState(initial.paymentApproved);
	const [sessionId, setSessionId] = useState(initial.sessionId ?? "");
	const [completedAt, setCompletedAt] = useState<string | undefined>(initial.completedAt);
	const [certNumber, setCertNumber] = useState(initial.certificate?.certificateNumber ?? "");
	const [issuedAtInput, setIssuedAtInput] = useState(isoToDateInput(initial.certificate?.issuedAt));

	useEffect(() => {
		setProgramApproved(initial.programApproved);
		setPaymentApproved(initial.paymentApproved);
		setSessionId(initial.sessionId ?? "");
		setCompletedAt(initial.completedAt);
		setCertNumber(initial.certificate?.certificateNumber ?? "");
		setIssuedAtInput(isoToDateInput(initial.certificate?.issuedAt));
	}, [
		initial.programApproved,
		initial.paymentApproved,
		initial.sessionId,
		initial.completedAt,
		initial.certificate?._id,
		initial.certificate?.certificateNumber,
		initial.certificate?.issuedAt,
	]);

	const patchMutation = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data } = await axios.patch(`/api/admin/enrollments/${enrollmentId}`, body);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
			queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
			router.refresh();
			toast.success("Enrollment updated");
		},
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Update failed");
		},
	});

	const certPatchMutation = useMutation({
		mutationFn: async ({
			certId,
			body,
		}: {
			certId: string;
			body: Record<string, unknown>;
		}) => {
			const { data } = await axios.patch(`/api/admin/certificates/${certId}`, body);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
			router.refresh();
			toast.success("Certificate updated");
		},
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Update failed");
		},
	});

	const certUploadMutation = useMutation({
		mutationFn: async ({ certId, file }: { certId: string; file: File }) => {
			const { data: presign } = await axios.post<{
				uploadUrl: string;
				key: string;
				url: string;
			}>("/api/admin/certificates/upload", {
				fileName: file.name,
				contentType: file.type,
			});
			await axios.put(presign.uploadUrl, file, {
				headers: { "Content-Type": file.type },
			});
			await axios.patch(`/api/admin/certificates/${certId}`, {
				documentUrl: presign.url,
				storageKey: presign.key,
				contentType: file.type,
				originalFileName: file.name,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
			router.refresh();
			toast.success("Certificate file uploaded");
		},
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Upload failed");
		},
	});

	const busy = patchMutation.isPending;
	const certBusy = certPatchMutation.isPending || certUploadMutation.isPending;
	const certId = initial.certificate?._id;
	const showCertificate = !!(completedAt || initial.certificate);
	const canMarkComplete = !!sessionId;

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

	const patchCompletion = (markComplete: boolean) => {
		const prev = completedAt;
		const next = markComplete ? new Date().toISOString() : null;
		setCompletedAt(markComplete ? next ?? undefined : undefined);
		patchMutation.mutate(
			{ completedAt: next },
			{
				onError: () => setCompletedAt(prev),
			}
		);
	};

	const saveCertMeta = () => {
		if (!certId) return;
		certPatchMutation.mutate({
			certId,
			body: {
				certificateNumber: certNumber.trim() || null,
				issuedAt: issuedAtInput
					? new Date(`${issuedAtInput}T12:00:00.000Z`).toISOString()
					: null,
			},
		});
	};

	const onCertFile = (file: File | null) => {
		if (!file || !certId) return;
		certUploadMutation.mutate({ certId, file });
	};

	return (
		<div className="max-w-2xl space-y-8">
			<div className="alert">
				<span className="text-sm">
					{pipelineSummary(
						initial.profileApproved,
						programApproved,
						paymentApproved,
						!!completedAt
					)}
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
				{!sessionId && (
					<p className="text-xs text-base-content/60">Assign a session before marking complete.</p>
				)}
			</section>

			<section className="space-y-3 max-w-md">
				<h2 className="text-xl font-semibold">Completion</h2>
				<label className="label cursor-pointer justify-start gap-3 w-fit">
					<input
						type="checkbox"
						className="checkbox checkbox-primary"
						checked={!!completedAt}
						disabled={busy || (!completedAt && !canMarkComplete)}
						onChange={(ev) => patchCompletion(ev.target.checked)}
					/>
					<span className="label-text">Mark enrollment complete</span>
				</label>
				{completedAt && (
					<p className="text-sm text-base-content/70">
						Completed {format(new Date(completedAt), "PPp")}
					</p>
				)}
			</section>

			{showCertificate && (
				<section className="space-y-4 max-w-md border border-base-300 rounded-lg p-4">
					<h2 className="text-xl font-semibold">Certificate</h2>
					{!certId ? (
						<p className="text-sm text-base-content/70">
							Certificate record will appear after you mark the enrollment complete. If you just did,
							refresh the page.
						</p>
					) : (
						<>
							<dl className="grid gap-2 text-sm">
								<div>
									<dt className="text-base-content/60">Program</dt>
									<dd>{initial.programTitle}</dd>
								</div>
								<div>
									<dt className="text-base-content/60">Session</dt>
									<dd>{initial.sessionLabel ?? "—"}</dd>
								</div>
								<div>
									<dt className="text-base-content/60">Downloads (student)</dt>
									<dd>{initial.certificate?.downloadCount ?? 0}</dd>
								</div>
								{initial.certificate?.documentUrl && (
									<div>
										<dt className="text-base-content/60">File</dt>
										<dd>
											<a
												href={initial.certificate.documentUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="link link-primary"
											>
												{initial.certificate.originalFileName ?? "View uploaded file"}
											</a>
										</dd>
									</div>
								)}
							</dl>

							<div className="form-control w-full">
								<label className="label py-1">
									<span className="label-text">Certificate file (PDF or image)</span>
								</label>
								<input
									type="file"
									className="file-input file-input-bordered w-full"
									accept=".pdf,image/jpeg,image/png,image/webp"
									disabled={certBusy}
									onChange={(ev) => onCertFile(ev.target.files?.[0] ?? null)}
								/>
							</div>

							<div className="form-control w-full">
								<label className="label py-1">
									<span className="label-text">Certificate number</span>
								</label>
								<input
									type="text"
									className="input input-bordered w-full"
									value={certNumber}
									disabled={certBusy}
									onChange={(ev) => setCertNumber(ev.target.value)}
								/>
							</div>

							<div className="form-control w-full">
								<label className="label py-1">
									<span className="label-text">Issued date</span>
								</label>
								<input
									type="date"
									className="input input-bordered w-full"
									value={issuedAtInput}
									disabled={certBusy}
									onChange={(ev) => setIssuedAtInput(ev.target.value)}
								/>
							</div>

							<button
								type="button"
								className="btn btn-primary btn-sm"
								disabled={certBusy}
								onClick={saveCertMeta}
							>
								Save certificate details
							</button>
						</>
					)}
				</section>
			)}
		</div>
	);
}
