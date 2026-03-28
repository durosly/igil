"use client";

import { format } from "date-fns";
import Link from "next/link";
import { memo } from "react";
import EnrollmentCertificateFileUpload from "./enrollment-certificate-file-upload";
import EnrollmentCertificateMetaForm from "./enrollment-certificate-meta-form";

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

type SessionOption = { _id: string; label: string };

type CertDisplay = {
	_id: string;
	downloadCount: number;
	documentUrl?: string;
	originalFileName?: string;
	certificateNumber?: string;
	issuedAt?: string;
	sessionLabel?: string;
} | null;

export const EnrollmentPipelineAlert = memo(function EnrollmentPipelineAlert({
	profileApproved,
	programApproved,
	paymentApproved,
	completed,
}: {
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	completed: boolean;
}) {
	return (
		<div className="alert">
			<span className="text-sm">
				{pipelineSummary(profileApproved, programApproved, paymentApproved, completed)}
			</span>
		</div>
	);
});

export const EnrollmentStudentSection = memo(function EnrollmentStudentSection({
	userId,
	studentName,
	studentEmail,
}: {
	userId: string;
	studentName?: string;
	studentEmail?: string;
}) {
	return (
		<section className="space-y-3">
			<h2 className="text-xl font-semibold">Student</h2>
			<p>
				<Link href={`/admin/students/${userId}`} className="link link-primary">
					{studentName ?? studentEmail ?? userId}
				</Link>
			</p>
			{studentEmail && studentName && (
				<p className="text-sm text-base-content/70">{studentEmail}</p>
			)}
		</section>
	);
});

export const EnrollmentProgramDetails = memo(function EnrollmentProgramDetails({
	programTitle,
	source,
	createdAt,
	profileApproved,
}: {
	programTitle: string;
	source: string;
	createdAt?: string;
	profileApproved: boolean;
}) {
	return (
		<section className="space-y-2 text-sm">
			<h2 className="text-xl font-semibold">Enrollment</h2>
			<dl className="grid gap-2">
				<div>
					<dt className="text-base-content/60">Program</dt>
					<dd className="font-medium">{programTitle}</dd>
				</div>
				<div>
					<dt className="text-base-content/60">Source</dt>
					<dd>{source}</dd>
				</div>
				<div>
					<dt className="text-base-content/60">Created</dt>
					<dd>{createdAt ? format(new Date(createdAt), "PPp") : "—"}</dd>
				</div>
				<div>
					<dt className="text-base-content/60">Profile approved</dt>
					<dd>{profileApproved ? "Yes" : "No"}</dd>
				</div>
			</dl>
		</section>
	);
});

export const EnrollmentApprovalsSection = memo(function EnrollmentApprovalsSection({
	programApproved,
	paymentApproved,
	busy,
	onProgramChange,
	onPaymentChange,
}: {
	programApproved: boolean;
	paymentApproved: boolean;
	busy: boolean;
	onProgramChange: (checked: boolean) => void;
	onPaymentChange: (checked: boolean) => void;
}) {
	return (
		<section className="space-y-4">
			<h2 className="text-xl font-semibold">Approvals</h2>
			<label className="label cursor-pointer justify-start gap-3 w-fit">
				<input
					type="checkbox"
					className="checkbox checkbox-primary"
					checked={programApproved}
					disabled={busy}
					onChange={(ev) => onProgramChange(ev.target.checked)}
				/>
				<span className="label-text">Program approved</span>
			</label>
			<label className="label cursor-pointer justify-start gap-3 w-fit">
				<input
					type="checkbox"
					className="checkbox checkbox-primary"
					checked={paymentApproved}
					disabled={busy}
					onChange={(ev) => onPaymentChange(ev.target.checked)}
				/>
				<span className="label-text">Payment approved</span>
			</label>
		</section>
	);
});

export const EnrollmentSessionSection = memo(function EnrollmentSessionSection({
	sessionId,
	sessions,
	busy,
	onSessionChange,
}: {
	sessionId: string;
	sessions: SessionOption[];
	busy: boolean;
	onSessionChange: (value: string) => void;
}) {
	return (
		<section className="space-y-2 max-w-md">
			<h2 className="text-xl font-semibold">Session</h2>
			<select
				className="select select-bordered w-full"
				value={sessionId}
				disabled={busy}
				onChange={(ev) => onSessionChange(ev.target.value)}
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
	);
});

export const EnrollmentCompletionSection = memo(function EnrollmentCompletionSection({
	completedAt,
	canMarkComplete,
	busy,
	onCompletionChange,
}: {
	completedAt?: string;
	canMarkComplete: boolean;
	busy: boolean;
	onCompletionChange: (markComplete: boolean) => void;
}) {
	return (
		<section className="space-y-3 max-w-md">
			<h2 className="text-xl font-semibold">Completion</h2>
			<label className="label cursor-pointer justify-start gap-3 w-fit">
				<input
					type="checkbox"
					className="checkbox checkbox-primary"
					checked={!!completedAt}
					disabled={busy || (!completedAt && !canMarkComplete)}
					onChange={(ev) => onCompletionChange(ev.target.checked)}
				/>
				<span className="label-text">Mark enrollment complete</span>
			</label>
			{completedAt && (
				<p className="text-sm text-base-content/70">
					Completed {format(new Date(completedAt), "PPp")}
				</p>
			)}
		</section>
	);
});

export const EnrollmentCertificatePanel = memo(function EnrollmentCertificatePanel({
	programTitle,
	sessionLabel,
	certificate,
	certId,
}: {
	programTitle: string;
	sessionLabel?: string;
	certificate: CertDisplay;
	certId: string | undefined;
}) {
	return (
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
							<dd>{programTitle}</dd>
						</div>
						<div>
							<dt className="text-base-content/60">Session</dt>
							<dd>{sessionLabel ?? "—"}</dd>
						</div>
						<div>
							<dt className="text-base-content/60">Downloads (student)</dt>
							<dd>{certificate?.downloadCount ?? 0}</dd>
						</div>
						{certificate?.documentUrl && (
							<div>
								<dt className="text-base-content/60">File</dt>
								<dd>
									<a
										href={certificate.documentUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="link link-primary"
									>
										{certificate.originalFileName ?? "View uploaded file"}
									</a>
								</dd>
							</div>
						)}
					</dl>

					<EnrollmentCertificateFileUpload certId={certId} />

					<EnrollmentCertificateMetaForm
						certId={certId}
						initialCertificateNumber={certificate?.certificateNumber}
						initialIssuedAtIso={certificate?.issuedAt}
					/>
				</>
			)}
		</section>
	);
});
