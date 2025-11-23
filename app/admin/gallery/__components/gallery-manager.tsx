"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import UploadForm from "./upoad-form";
import EditImageForm from "./edit-image-form";
import DeleteImageBtn from "./delete-image-btn";

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

export default function GalleryManager() {
	const [images, setImages] = useState<GalleryImage[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchImages();
	}, []);

	const fetchImages = async () => {
		try {
			const response = await fetch("/api/gallery");
			if (response.ok) {
				const data = await response.json();
				setImages(data);
			}
		} catch (error) {
			console.error("Error fetching images:", error);
			toast.error("Failed to fetch images", {
				description: "Please try refreshing the page.",
			});
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-4xl font-bold">Gallery Management</h1>
				<UploadForm onUploadSuccess={fetchImages} />
			</div>

			{images.length === 0 ? (
				<div className="alert alert-info">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						className="stroke-current shrink-0 w-6 h-6">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>No images yet. Upload your first image to get started!</span>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{images.map((image) => (
						<div
							key={image._id}
							className="card bg-base-200 shadow-xl overflow-hidden">
							<figure className="relative aspect-square w-full">
								<Image
									src={image.thumbnailUrl || image.imageUrl}
									alt={image.title}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>
							</figure>
							<div className="card-body">
								<h2 className="card-title line-clamp-1">
									{image.title}
								</h2>
								<p className="line-clamp-2 text-sm">
									{image.description}
								</p>
								<div className="card-actions justify-end mt-4">
									<EditImageForm
										image={image}
										onEditSuccess={fetchImages}
									/>
									<DeleteImageBtn
										image={image}
										onDeleteSuccess={fetchImages}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
