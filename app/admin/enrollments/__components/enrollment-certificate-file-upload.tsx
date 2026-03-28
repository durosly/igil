"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { memo, useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type CertificateFileUploadProps = {
	certId: string;
};

/**
 * Self-contained certificate file upload with S3 PUT progress.
 * Keeps upload state local so ancestors do not re-render on progress ticks.
 */
function EnrollmentCertificateFileUpload({ certId }: CertificateFileUploadProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const inputRef = useRef<HTMLInputElement>(null);
	const [progress, setProgress] = useState(0);
	const [phase, setPhase] = useState<"idle" | "working">("idle");

	const uploadMutation = useMutation({
		mutationFn: async (file: File) => {
			setPhase("working");
			setProgress(5);

			const { data: presign } = await axios.post<{
				uploadUrl: string;
				key: string;
				url: string;
			}>("/api/admin/certificates/upload", {
				fileName: file.name,
				contentType: file.type,
			});

			setProgress(12);

			await axios.put(presign.uploadUrl, file, {
				headers: { "Content-Type": file.type || "application/octet-stream" },
				onUploadProgress: (ev) => {
					const total = ev.total || file.size;
					if (total <= 0) return;
					const pct = 12 + Math.round((ev.loaded / total) * 78);
					setProgress(Math.min(pct, 90));
				},
			});

			setProgress(92);

			await axios.patch(`/api/admin/certificates/${certId}`, {
				documentUrl: presign.url,
				storageKey: presign.key,
				contentType: file.type,
				originalFileName: file.name,
			});

			setProgress(100);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
			router.refresh();
			toast.success("Certificate file uploaded");
			setProgress(0);
			setPhase("idle");
			if (inputRef.current) inputRef.current.value = "";
		},
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Upload failed");
			setProgress(0);
			setPhase("idle");
		},
	});

	const busy = uploadMutation.isPending;

	const onFile = useCallback(
		(file: File | null) => {
			if (!file) return;
			uploadMutation.mutate(file);
		},
		[uploadMutation]
	);

	return (
		<div className="form-control w-full">
			<label className="label py-1">
				<span className="label-text">Certificate file (PDF or image)</span>
			</label>
			<input
				ref={inputRef}
				type="file"
				className="file-input file-input-bordered w-full"
				accept=".pdf,image/jpeg,image/png,image/webp"
				disabled={busy}
				onChange={(ev) => onFile(ev.target.files?.[0] ?? null)}
			/>
			{phase === "working" && (
				<div className="mt-3 space-y-1">
					<progress
						className="progress progress-primary w-full"
						value={progress}
						max={100}
					/>
					<p className="text-xs text-base-content/70">
						{progress < 12 ? "Preparing upload…" : progress < 92 ? "Uploading…" : "Finishing…"}
					</p>
				</div>
			)}
		</div>
	);
}

export default memo(EnrollmentCertificateFileUpload);
