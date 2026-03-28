"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
	EnrollmentApprovalsSection,
	EnrollmentCertificatePanel,
	EnrollmentCompletionSection,
	EnrollmentPipelineAlert,
	EnrollmentProgramDetails,
	EnrollmentSessionSection,
	EnrollmentStudentSection,
} from "./enrollment-detail-sections";

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

export type EnrollmentDetailInitial = {
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

	useEffect(() => {
		setProgramApproved(initial.programApproved);
		setPaymentApproved(initial.paymentApproved);
		setSessionId(initial.sessionId ?? "");
		setCompletedAt(initial.completedAt);
	}, [
		initial.programApproved,
		initial.paymentApproved,
		initial.sessionId,
		initial.completedAt,
	]);

	const { mutate: patchEnrollment, isPending: patchPending } = useMutation({
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

	const busy = patchPending;
	const certId = initial.certificate?._id;
	const showCertificate = !!(completedAt || initial.certificate);
	const canMarkComplete = !!sessionId;

	const patchProgram = useCallback(
		(checked: boolean) => {
			const prev = programApproved;
			setProgramApproved(checked);
			patchEnrollment(
				{ programApproved: checked },
				{ onError: () => setProgramApproved(prev) }
			);
		},
		[programApproved, patchEnrollment]
	);

	const patchPayment = useCallback(
		(checked: boolean) => {
			const prev = paymentApproved;
			setPaymentApproved(checked);
			patchEnrollment(
				{ paymentApproved: checked },
				{ onError: () => setPaymentApproved(prev) }
			);
		},
		[paymentApproved, patchEnrollment]
	);

	const patchSession = useCallback(
		(value: string) => {
			const prev = sessionId;
			setSessionId(value);
			patchEnrollment(
				{ sessionId: value || "" },
				{ onError: () => setSessionId(prev) }
			);
		},
		[sessionId, patchEnrollment]
	);

	const patchCompletion = useCallback(
		(markComplete: boolean) => {
			const prev = completedAt;
			const next = markComplete ? new Date().toISOString() : null;
			setCompletedAt(markComplete ? next ?? undefined : undefined);
			patchEnrollment(
				{ completedAt: next },
				{
					onError: () => setCompletedAt(prev),
				}
			);
		},
		[completedAt, patchEnrollment]
	);

	return (
		<div className="max-w-2xl space-y-8">
			<EnrollmentPipelineAlert
				profileApproved={initial.profileApproved}
				programApproved={programApproved}
				paymentApproved={paymentApproved}
				completed={!!completedAt}
			/>

			<EnrollmentStudentSection
				userId={initial.userId}
				studentName={initial.studentName}
				studentEmail={initial.studentEmail}
			/>

			<EnrollmentProgramDetails
				programTitle={initial.programTitle}
				source={initial.source}
				createdAt={initial.createdAt}
				profileApproved={initial.profileApproved}
			/>

			<EnrollmentApprovalsSection
				programApproved={programApproved}
				paymentApproved={paymentApproved}
				busy={busy}
				onProgramChange={patchProgram}
				onPaymentChange={patchPayment}
			/>

			<EnrollmentSessionSection
				sessionId={sessionId}
				sessions={sessions}
				busy={busy}
				onSessionChange={patchSession}
			/>

			<EnrollmentCompletionSection
				completedAt={completedAt}
				canMarkComplete={canMarkComplete}
				busy={busy}
				onCompletionChange={patchCompletion}
			/>

			{showCertificate && (
				<EnrollmentCertificatePanel
					programTitle={initial.programTitle}
					sessionLabel={initial.sessionLabel}
					certificate={initial.certificate}
					certId={certId}
				/>
			)}
		</div>
	);
}
