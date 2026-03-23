"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Loader2, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/handle-error";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"] as const;
const MAX_BYTES = 10 * 1024 * 1024;

type UploadVars = {
	file: File;
	signal: AbortSignal;
	setProgress: React.Dispatch<React.SetStateAction<number>>;
};

async function uploadCoverToStorage({ file, signal, setProgress }: UploadVars): Promise<string> {
	setProgress(0);
	const uploadRes = await axios.post<{ uploadUrl: string; url: string }>(
		"/api/gallery/upload",
		{ fileName: file.name, contentType: file.type },
		{ signal }
	);
	const { uploadUrl, url } = uploadRes.data;
	await axios.put(uploadUrl, file, {
		headers: { "Content-Type": file.type },
		signal,
		onUploadProgress: (e) => {
			if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
		},
	});
	return url;
}

export interface ProgramCoverUploadProps {
	value: string;
	onChange: (url: string) => void;
	disabled?: boolean;
	onUploadingChange?: (uploading: boolean) => void;
}

export default function ProgramCoverUpload({
	value,
	onChange,
	disabled = false,
	onUploadingChange,
}: ProgramCoverUploadProps) {
	const [objectUrl, setObjectUrl] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const abortRef = useRef<AbortController | null>(null);

	const revokeObjectUrl = useCallback((url: string | null) => {
		if (url) URL.revokeObjectURL(url);
	}, []);

	const uploadMutation = useMutation({
		mutationFn: uploadCoverToStorage,
		onMutate: () => onUploadingChange?.(true),
		onSuccess: (url) => {
			onChange(url);
			setObjectUrl((prev) => {
				revokeObjectUrl(prev);
				return null;
			});
			setUploadProgress(0);
			abortRef.current = null;
		},
		onError: (err) => {
			if (axios.isCancel(err)) return;
			toast.error(handleError(err));
			setObjectUrl((prev) => {
				revokeObjectUrl(prev);
				return null;
			});
			setUploadProgress(0);
			abortRef.current = null;
		},
		onSettled: () => onUploadingChange?.(false),
	});

	useEffect(() => {
		return () => revokeObjectUrl(objectUrl);
	}, [objectUrl, revokeObjectUrl]);

	const validateFile = (file: File) => {
		if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
			toast.error("Invalid file type");
			return false;
		}
		if (file.size > MAX_BYTES) {
			toast.error("File must be under 10MB");
			return false;
		}
		return true;
	};

	const startUpload = (file: File) => {
		if (!validateFile(file)) return;
		uploadMutation.reset();
		setObjectUrl((prev) => {
			revokeObjectUrl(prev);
			return URL.createObjectURL(file);
		});
		setUploadProgress(0);
		const controller = new AbortController();
		abortRef.current = controller;
		uploadMutation.mutate({
			file,
			signal: controller.signal,
			setProgress: setUploadProgress,
		});
	};

	const onDrop = (accepted: File[]) => {
		const file = accepted[0];
		if (file) startUpload(file);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [".jpg", ".jpeg"],
			"image/png": [".png"],
			"image/webp": [".webp"],
			"image/gif": [".gif"],
		},
		maxFiles: 1,
		disabled: disabled || uploadMutation.isPending,
		multiple: false,
	});

	const cancelUpload = () => {
		abortRef.current?.abort();
		abortRef.current = null;
		setUploadProgress(0);
		setObjectUrl((prev) => {
			revokeObjectUrl(prev);
			return null;
		});
	};

	const clearImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		cancelUpload();
		onChange("");
	};

	const displaySrc = objectUrl || value || null;
	const busy = uploadMutation.isPending;

	return (
		<div
			{...getRootProps({
				className: `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
					isDragActive ? "border-primary bg-primary/5" : "hover:border-primary/50"
				} ${disabled ? "opacity-70 pointer-events-none" : ""} ${busy && !displaySrc ? "cursor-wait" : ""}`,
			})}
		>
			<input {...getInputProps()} />

			{displaySrc ? (
				<div className="space-y-3">
					<div className="relative aspect-video max-h-48 mx-auto rounded overflow-hidden bg-base-300">
						{displaySrc.startsWith("https://") ? (
							<Image src={displaySrc} alt="Cover" fill className="object-contain" sizes="(max-width: 42rem) 100vw, 42rem" />
						) : (
							// eslint-disable-next-line @next/next/no-img-element -- blob/data preview
							<img src={displaySrc} alt="Cover preview" className="w-full h-full object-contain" />
						)}
						{!busy && (
							<button
								type="button"
								className="btn btn-sm btn-circle absolute top-1 right-1"
								onClick={clearImage}
								disabled={disabled}
							>
								<XIcon className="w-4 h-4" />
							</button>
						)}
					</div>
					{busy && (
						<div className="space-y-2 text-left max-w-md mx-auto">
							<div className="flex items-center justify-between gap-2 text-sm">
								<span className="flex items-center gap-2 text-base-content/80">
									<Loader2 className="w-4 h-4 animate-spin shrink-0" />
									Uploading… {uploadProgress}%
								</span>
								<button type="button" className="btn btn-ghost btn-sm" onClick={(e) => (e.stopPropagation(), cancelUpload())}>
									Cancel upload
								</button>
							</div>
							<progress className="progress progress-primary w-full" value={uploadProgress} max={100} />
						</div>
					)}
				</div>
			) : (
				<>
					<UploadIcon className="w-12 h-12 mx-auto text-base-content/40" />
					<p className="text-sm text-base-content/70 mt-2">
						{isDragActive ? "Drop the image here" : "Drag and drop a cover image, or click to choose"}
					</p>
				</>
			)}
		</div>
	);
}
