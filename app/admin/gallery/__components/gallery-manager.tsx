"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

interface PaginationData {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export default function GalleryManager() {
	const [images, setImages] = useState<GalleryImage[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState<PaginationData>({
		page: 1,
		limit: 12,
		total: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	useEffect(() => {
		fetchImages(1);
	}, []);

	const fetchImages = async (page: number = 1) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/gallery?page=${page}&limit=12`);
			if (response.ok) {
				const data = await response.json();
				setImages(data.data);
				setPagination(data.pagination);
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

	const handlePageChange = (newPage: number) => {
		fetchImages(newPage);
		// Scroll to top
		window.scrollTo({ top: 0, behavior: "smooth" });
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
				<UploadForm onUploadSuccess={() => fetchImages(1)} />
			</div>

			{images.length === 0 ? (
				<div className="alert alert-info">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>No images yet. Upload your first image to get started!</span>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{images.map((image) => (
							<div key={image._id} className="card bg-base-200 shadow-xl overflow-hidden">
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
									<h2 className="card-title line-clamp-1">{image.title}</h2>
									<p className="line-clamp-2 text-sm">{image.description}</p>
									<div className="card-actions justify-end mt-4">
										<EditImageForm image={image} onEditSuccess={() => fetchImages(pagination.page)} />
										<DeleteImageBtn image={image} onDeleteSuccess={() => fetchImages(1)} />
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Pagination Controls */}
					<div className="flex flex-col items-center gap-4 mt-8 py-6">
						<div className="text-sm text-base-content/70">
							Showing {images.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{" "}
							{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} images
						</div>

						<div className="flex gap-2 items-center">
							<button
								onClick={() => handlePageChange(pagination.page - 1)}
								disabled={!pagination.hasPrevPage}
								className="btn btn-sm btn-outline gap-2"
								aria-label="Previous page">
								<ChevronLeft className="w-4 h-4" />
								Previous
							</button>

							<div className="flex gap-1">
								{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
									<button
										key={page}
										onClick={() => handlePageChange(page)}
										className={`btn btn-sm ${page === pagination.page ? "btn-active" : "btn-outline"}`}
										aria-label={`Go to page ${page}`}
										aria-current={page === pagination.page ? "page" : undefined}>
										{page}
									</button>
								))}
							</div>

							<button
								onClick={() => handlePageChange(pagination.page + 1)}
								disabled={!pagination.hasNextPage}
								className="btn btn-sm btn-outline gap-2"
								aria-label="Next page">
								Next
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
