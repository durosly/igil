"use client";

import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { handleError } from "@/lib/handle-error";

interface UploadFormProps {
	onUploadSuccess?: () => void;
}

function UploadForm({ onUploadSuccess }: UploadFormProps) {
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [dragActive, setDragActive] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		file: null as File | null,
	});

	const [errors, setErrors] = useState({
		title: "",
		description: "",
		file: "",
	});

	const validateForm = (): boolean => {
		const newErrors = {
			title: "",
			description: "",
			file: "",
		};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		}

		if (!formData.file) {
			newErrors.file = "Please select an image file";
		} else {
			// Validate file type
			const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
			if (!allowedTypes.includes(formData.file.type)) {
				newErrors.file = "Invalid file type. Only images are allowed.";
			}

			// Validate file size (max 10MB)
			const maxSize = 10 * 1024 * 1024; // 10MB
			if (formData.file.size > maxSize) {
				newErrors.file = "File size must be less than 10MB";
			}
		}

		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error !== "");
	};

	const handleFileSelect = useCallback((file: File) => {
		// Validate file type
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
		if (!allowedTypes.includes(file.type)) {
			toast.error("Invalid file type", {
				description: "Only image files (JPEG, PNG, WebP, GIF) are allowed.",
			});
			return;
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			toast.error("File too large", {
				description: "File size must be less than 10MB.",
			});
			return;
		}

		setFormData((prev) => ({ ...prev, file }));
		setErrors((prev) => ({ ...prev, file: "" }));

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			handleFileSelect(e.target.files[0]);
		}
	};

	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);

			if (e.dataTransfer.files && e.dataTransfer.files[0]) {
				handleFileSelect(e.dataTransfer.files[0]);
			}
		},
		[handleFileSelect]
	);

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			file: null,
		});
		setErrors({
			title: "",
			description: "",
			file: "",
		});
		setPreview(null);
		setUploadProgress(0);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleClose = () => {
		if (!uploading) {
			setShowUploadModal(false);
			resetForm();
		}
	};

	const handleUpload = async () => {
		if (!validateForm()) {
			toast.error("Validation failed", {
				description: "Please fix the errors in the form.",
			});
			return;
		}

		if (!formData.file) return;

		setUploading(true);
		setUploadProgress(0);
		const uploadToast = toast.loading("Uploading image...", {
			description: "Please wait while we upload your image.",
		});

		try {
			// Step 1: Get presigned URL
			const uploadResponse = await axios.post("/api/gallery/upload", {
				fileName: formData.file.name,
				contentType: formData.file.type,
			});

			const { uploadUrl, url: imageUrl } = uploadResponse.data;

			// Step 2: Upload to S3 using presigned URL with progress tracking
			await axios.put(uploadUrl, formData.file, {
				headers: {
					"Content-Type": formData.file.type,
				},
				onUploadProgress: (progressEvent) => {
					if (progressEvent.total) {
						const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						setUploadProgress(percentCompleted);
					}
				},
			});

			// Step 3: Create gallery entry (include file size in bytes)
			await axios.post("/api/gallery", {
				title: formData.title.trim(),
				description: formData.description.trim(),
				imageUrl: imageUrl,
				fileSize: formData.file.size,
			});

			toast.success("Image uploaded successfully!", {
				id: uploadToast,
				description: `${formData.title} has been added to the gallery.`,
			});

			// Refresh gallery if callback provided
			if (onUploadSuccess) {
				onUploadSuccess();
			}

			handleClose();
		} catch (error) {
			console.error("Error uploading image:", error);
			const errorMessage = handleError(error);
			toast.error("Upload failed", {
				id: uploadToast,
				description: errorMessage,
			});
			setUploadProgress(0);
		} finally {
			setUploading(false);
		}
	};

	return (
		<>
			<button onClick={() => setShowUploadModal(true)} className="btn btn-primary gap-2">
				<PlusIcon className="w-5 h-5" />
				Upload Image
			</button>

			{/* Upload Modal */}
			{showUploadModal && (
				<div className="modal modal-open">
					<div className="modal-box max-w-md">
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-bold text-lg">Upload New Image</h3>
							<button onClick={handleClose} disabled={uploading} className="btn btn-sm btn-ghost btn-circle">
								<XIcon className="w-5 h-5" />
							</button>
						</div>

						<div className="space-y-4">
							{/* Title Field */}
							<div className="fieldset">
								<label className="label">
									<span className="label-text">
										Title <span className="text-error">*</span>
									</span>
								</label>
								<input
									type="text"
									placeholder="Image title"
									className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
									value={formData.title}
									onChange={(e) => {
										setFormData({
											...formData,
											title: e.target.value,
										});
										setErrors({ ...errors, title: "" });
									}}
									disabled={uploading}
								/>
								{errors.title && (
									<label className="label">
										<span className="label-text-alt text-error">{errors.title}</span>
									</label>
								)}
							</div>

							{/* Description Field */}
							<div className="fieldset">
								<label className="label">
									<span className="label-text">
										Description <span className="text-error">*</span>
									</span>
								</label>
								<textarea
									placeholder="Image description"
									className={`textarea textarea-bordered w-full ${errors.description ? "textarea-error" : ""}`}
									value={formData.description}
									onChange={(e) => {
										setFormData({
											...formData,
											description: e.target.value,
										});
										setErrors({
											...errors,
											description: "",
										});
									}}
									disabled={uploading}
									rows={3}
								/>
								{errors.description && (
									<label className="label">
										<span className="label-text-alt text-error">{errors.description}</span>
									</label>
								)}
							</div>

							{/* File Upload - Drag and Drop */}
							<div className="fieldset">
								<label className="label">
									<span className="label-text">
										Image File <span className="text-error">*</span>
									</span>
								</label>
								<div
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDragOver={handleDrag}
									onDrop={handleDrop}
									className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
										dragActive
											? "border-primary bg-primary/10"
											: errors.file
											? "border-error bg-error/5"
											: "border-base-300 hover:border-primary/50"
									} ${uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
									onClick={() => !uploading && fileInputRef.current?.click()}>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleFileChange}
										disabled={uploading}
									/>

									{preview ? (
										<div className="space-y-4">
											<div className="relative w-full h-48 mx-auto rounded-lg overflow-hidden">
												<Image src={preview} alt="Preview" fill className="object-contain" />
											</div>
											<div className="text-sm">
												<p className="font-medium">{formData.file?.name}</p>
												<p className="text-base-content/60">
													{formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : ""}
												</p>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														setPreview(null);
														setFormData({
															...formData,
															file: null,
														});
														if (fileInputRef.current) {
															fileInputRef.current.value = "";
														}
													}}
													disabled={uploading}
													className="btn btn-sm btn-ghost mt-2">
													Remove
												</button>
											</div>
										</div>
									) : (
										<div className="space-y-2">
											<UploadIcon className="w-12 h-12 mx-auto text-base-content/40" />
											<p className="text-base-content/70">
												{dragActive
													? "Drop the image here"
													: "Drag and drop an image here, or click to select"}
											</p>
											<p className="text-sm text-base-content/50">Supports: JPEG, PNG, WebP, GIF (Max 10MB)</p>
										</div>
									)}
								</div>
								{errors.file && (
									<label className="label">
										<span className="label-text-alt text-error">{errors.file}</span>
									</label>
								)}
							</div>

							{/* Upload Progress Bar */}
							{uploading && (
								<div className="fieldset">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium">Upload Progress</span>
										<span className="text-sm text-base-content/60">{uploadProgress}%</span>
									</div>
									<progress className="progress progress-primary w-full" value={uploadProgress} max="100">
										{uploadProgress}%
									</progress>
								</div>
							)}
						</div>

						<div className="modal-action">
							<button className="btn" onClick={handleClose} disabled={uploading}>
								Cancel
							</button>
							<button className="btn btn-primary" onClick={handleUpload} disabled={uploading || !formData.file}>
								{uploading ? (
									<>
										<span className="loading loading-spinner"></span>
										Uploading...
									</>
								) : (
									<>
										<UploadIcon className="w-4 h-4" />
										Upload
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default UploadForm;
