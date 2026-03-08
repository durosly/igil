"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { UploadIcon, XIcon } from "lucide-react";
import { handleError } from "@/lib/handle-error";

const STATUS_OPTIONS = ["draft", "active", "completed"] as const;

interface ProgramFormProps {
	program?: {
		_id: string;
		title: string;
		description: string;
		coverImageUrl?: string;
		paymentInstruction?: string;
		status: string;
	};
}

export default function ProgramForm({ program }: ProgramFormProps) {
	const router = useRouter();
	const [saving, setSaving] = useState(false);
	const [coverPreview, setCoverPreview] = useState<string | null>(program?.coverImageUrl ?? null);
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState({
		title: program?.title ?? "",
		description: program?.description ?? "",
		coverImageUrl: program?.coverImageUrl ?? "",
		paymentInstruction: program?.paymentInstruction ?? "",
		status: program?.status ?? "draft",
	});

	const [errors, setErrors] = useState({
		title: "",
		description: "",
	});

	const validate = () => {
		const e = { title: "", description: "" };
		if (!formData.title.trim()) e.title = "Title is required";
		if (!formData.description.trim()) e.description = "Description is required";
		setErrors(e);
		return !e.title && !e.description;
	};

	const handleCoverSelect = useCallback((file: File) => {
		const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
		if (!allowed.includes(file.type)) {
			toast.error("Invalid file type");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			toast.error("File must be under 10MB");
			return;
		}
		setCoverFile(file);
		const reader = new FileReader();
		reader.onloadend = () => setCoverPreview(reader.result as string);
		reader.readAsDataURL(file);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setSaving(true);
		try {
			let coverImageUrl = formData.coverImageUrl;
			if (coverFile) {
				const uploadRes = await axios.post("/api/gallery/upload", {
					fileName: coverFile.name,
					contentType: coverFile.type,
				});
				const { uploadUrl, url } = uploadRes.data;
				await axios.put(uploadUrl, coverFile, { headers: { "Content-Type": coverFile.type } });
				coverImageUrl = url;
			}

			const payload = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				paymentInstruction: formData.paymentInstruction.trim() || undefined,
				status: formData.status,
				coverImageUrl: coverImageUrl || undefined,
			};

			if (program) {
				const res = await axios.patch(`/api/programs/${program._id}`, payload);
				toast.success("Program updated");
				router.push("/admin/programs");
			} else {
				await axios.post("/api/programs", payload);
				toast.success("Program created");
				router.push("/admin/programs");
			}
		} catch (err) {
			toast.error(handleError(err));
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl max-w-2xl">
			<div className="card-body space-y-4">
				<div className="form-control">
					<label className="label">
						<span className="label-text">Title *</span>
					</label>
					<input
						type="text"
						className={`input input-bordered ${errors.title ? "input-error" : ""}`}
						value={formData.title}
						onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))}
						disabled={saving}
					/>
					{errors.title && <span className="label-text-alt text-error">{errors.title}</span>}
				</div>

				<div className="form-control">
					<label className="label">
						<span className="label-text">Description *</span>
					</label>
					<textarea
						className={`textarea textarea-bordered ${errors.description ? "textarea-error" : ""}`}
						value={formData.description}
						onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
						rows={4}
						disabled={saving}
					/>
					{errors.description && (
						<span className="label-text-alt text-error">{errors.description}</span>
					)}
				</div>

				<div className="form-control">
					<label className="label">
						<span className="label-text">Cover image</span>
					</label>
					<div
						className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50"
						onClick={() => fileInputRef.current?.click()}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(e) => e.target.files?.[0] && handleCoverSelect(e.target.files[0])}
						/>
						{coverPreview ? (
							<div className="relative aspect-video max-h-48 mx-auto rounded overflow-hidden">
								<Image src={coverPreview} alt="Cover" fill className="object-contain" />
								<button
									type="button"
									className="btn btn-sm btn-circle absolute top-1 right-1"
									onClick={(ev) => {
										ev.stopPropagation();
										setCoverPreview(null);
										setCoverFile(null);
										setFormData((d) => ({ ...d, coverImageUrl: "" }));
									}}
								>
									<XIcon className="w-4 h-4" />
								</button>
							</div>
						) : (
							<>
								<UploadIcon className="w-12 h-12 mx-auto text-base-content/40" />
								<p className="text-sm text-base-content/70 mt-2">Click to upload cover image</p>
							</>
						)}
					</div>
				</div>

				<div className="form-control">
					<label className="label">
						<span className="label-text">Payment instruction</span>
					</label>
					<textarea
						className="textarea textarea-bordered"
						value={formData.paymentInstruction}
						onChange={(e) => setFormData((d) => ({ ...d, paymentInstruction: e.target.value }))}
						rows={3}
						placeholder="Instructions for payment..."
						disabled={saving}
					/>
				</div>

				<div className="form-control">
					<label className="label">
						<span className="label-text">Status</span>
					</label>
					<select
						className="select select-bordered"
						value={formData.status}
						onChange={(e) => setFormData((d) => ({ ...d, status: e.target.value }))}
						disabled={saving}
					>
						{STATUS_OPTIONS.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>

				<div className="card-actions justify-end gap-2 pt-4">
					<button
						type="button"
						className="btn btn-ghost"
						onClick={() => router.back()}
						disabled={saving}
					>
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={saving}>
						{saving ? "Saving..." : program ? "Update" : "Create"}
					</button>
				</div>
			</div>
		</form>
	);
}
