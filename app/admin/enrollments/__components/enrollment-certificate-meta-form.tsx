"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";

function isoToDateInput(iso?: string): string {
	if (!iso) return "";
	try {
		return format(new Date(iso), "yyyy-MM-dd");
	} catch {
		return "";
	}
}

type CertificateMetaFormProps = {
	certId: string;
	initialCertificateNumber?: string;
	initialIssuedAtIso?: string;
};

/**
 * Certificate number + issued date; local state so typing does not re-render the rest of the page.
 */
function EnrollmentCertificateMetaFormInner({
	certId,
	initialCertificateNumber,
	initialIssuedAtIso,
}: CertificateMetaFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [certNumber, setCertNumber] = useState(initialCertificateNumber ?? "");
	const [issuedAtInput, setIssuedAtInput] = useState(isoToDateInput(initialIssuedAtIso));

	useEffect(() => {
		setCertNumber(initialCertificateNumber ?? "");
		setIssuedAtInput(isoToDateInput(initialIssuedAtIso));
	}, [initialCertificateNumber, initialIssuedAtIso, certId]);

	const certPatchMutation = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
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

	const busy = certPatchMutation.isPending;

	const saveCertMeta = () => {
		certPatchMutation.mutate({
			certificateNumber: certNumber.trim() || null,
			issuedAt: issuedAtInput
				? new Date(`${issuedAtInput}T12:00:00.000Z`).toISOString()
				: null,
		});
	};

	return (
		<>
			<div className="form-control w-full">
				<label className="label py-1">
					<span className="label-text">Certificate number</span>
				</label>
				<input
					type="text"
					className="input input-bordered w-full"
					value={certNumber}
					disabled={busy}
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
					disabled={busy}
					onChange={(ev) => setIssuedAtInput(ev.target.value)}
				/>
			</div>

			<button
				type="button"
				className="btn btn-primary btn-sm"
				disabled={busy}
				onClick={saveCertMeta}
			>
				Save certificate details
			</button>
		</>
	);
}

export default memo(EnrollmentCertificateMetaFormInner);
