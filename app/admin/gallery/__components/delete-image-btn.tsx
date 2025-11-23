"use client";

import { TrashIcon, XIcon } from "lucide-react";
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

interface DeleteImageBtnProps {
	image: GalleryImage;
	onDeleteSuccess?: () => void;
}

export default function DeleteImageBtn({ image, onDeleteSuccess }: DeleteImageBtnProps) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		setDeleting(true);
		const deleteToast = toast.loading("Deleting image...", {
			description: "Please wait while we delete the image.",
		});

		try {
			const response = await fetch(`/api/gallery/${image._id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete image");
			}

			toast.success("Image deleted successfully!", {
				id: deleteToast,
				description: `${image.title} has been deleted.`,
			});

			// Refresh gallery if callback provided
			if (onDeleteSuccess) {
				onDeleteSuccess();
			}

			setShowDeleteModal(false);
		} catch (error) {
			console.error("Error deleting image:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete image";
			toast.error("Delete failed", {
				id: deleteToast,
				description: errorMessage,
			});
		} finally {
			setDeleting(false);
		}
	};

	const handleClose = () => {
		if (!deleting) {
			setShowDeleteModal(false);
		}
	};

	return (
		<>
			<button
				onClick={() => setShowDeleteModal(true)}
				className="btn btn-sm btn-error gap-2">
				<TrashIcon className="w-4 h-4" />
				Delete
			</button>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="modal modal-open">
					<div className="modal-box">
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-bold text-lg">Delete Image</h3>
							<button
								onClick={handleClose}
								disabled={deleting}
								className="btn btn-sm btn-ghost btn-circle">
								<XIcon className="w-5 h-5" />
							</button>
						</div>
						<p>
							Are you sure you want to delete &quot;{image.title}
							&quot;? This action cannot be undone.
						</p>
						<div className="modal-action">
							<button
								className="btn"
								onClick={handleClose}
								disabled={deleting}>
								Cancel
							</button>
							<button
								className="btn btn-error"
								onClick={handleDelete}
								disabled={deleting}>
								{deleting ? (
									<>
										<span className="loading loading-spinner"></span>
										Deleting...
									</>
								) : (
									"Delete"
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

