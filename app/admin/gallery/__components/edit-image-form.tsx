"use client";

import { PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GalleryImage {
	_id: string;
	title: string;
	description: string;
	imageUrl: string;
	thumbnailUrl?: string;
	order?: number;
	createdAt?: string;
	updatedAt?: string;
}

interface EditImageFormProps {
	image: GalleryImage;
	onEditSuccess?: () => void;
}

export default function EditImageForm({ image, onEditSuccess }: EditImageFormProps) {
	const [showEditModal, setShowEditModal] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [formData, setFormData] = useState({
		title: image.title,
		description: image.description,
	});

	const handleEdit = async () => {
		if (!formData.title.trim() || !formData.description.trim()) {
			toast.error("Validation failed", {
				description: "Please fill in all fields.",
			});
			return;
		}

		setUpdating(true);
		const editToast = toast.loading("Updating image...", {
			description: "Please wait while we update the image.",
		});

		try {
			const response = await fetch(`/api/gallery/${image._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: formData.title.trim(),
					description: formData.description.trim(),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update image");
			}

			toast.success("Image updated successfully!", {
				id: editToast,
				description: `${formData.title} has been updated.`,
			});

			// Refresh gallery if callback provided
			if (onEditSuccess) {
				onEditSuccess();
			}

			setShowEditModal(false);
		} catch (error) {
			console.error("Error updating image:", error);
			const errorMessage = error instanceof Error ? error.message : "Failed to update image";
			toast.error("Update failed", {
				id: editToast,
				description: errorMessage,
			});
		} finally {
			setUpdating(false);
		}
	};

	const handleClose = () => {
		if (!updating) {
			setShowEditModal(false);
			// Reset form data to original values
			setFormData({
				title: image.title,
				description: image.description,
			});
		}
	};

	return (
		<>
			<button onClick={() => setShowEditModal(true)} className="btn btn-sm btn-primary gap-2">
				<PencilIcon className="w-4 h-4" />
				Edit
			</button>

			{/* Edit Modal */}
			{showEditModal && (
				<div className="modal modal-open">
					<div className="modal-box">
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-bold text-lg">Edit Image</h3>
							<button
								onClick={handleClose}
								disabled={updating}
								className="btn btn-sm btn-ghost btn-circle">
								<XIcon className="w-5 h-5" />
							</button>
						</div>
						<div className="space-y-4">
							<div className="fieldset">
								<label className="label">
									<span className="label-text">Title</span>
								</label>
								<input
									type="text"
									placeholder="Image title"
									className="input input-bordered"
									value={formData.title}
									onChange={(e) =>
										setFormData({
											...formData,
											title: e.target.value,
										})
									}
									disabled={updating}
								/>
							</div>
							<div className="fieldset">
								<label className="label">
									<span className="label-text">Description</span>
								</label>
								<textarea
									placeholder="Image description"
									className="textarea textarea-bordered"
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									disabled={updating}
									rows={3}
								/>
							</div>
						</div>
						<div className="modal-action">
							<button
								className="btn"
								onClick={handleClose}
								disabled={updating}>
								Cancel
							</button>
							<button
								className="btn btn-primary"
								onClick={handleEdit}
								disabled={updating}>
								{updating ? (
									<>
										<span className="loading loading-spinner"></span>
										Updating...
									</>
								) : (
									"Save Changes"
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
