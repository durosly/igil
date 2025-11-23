"use client";

import { useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";

interface GalleryImage {
	_id: string;
	title: string;
	description: string;
	imageUrl: string;
	thumbnailUrl?: string;
	order?: number;
}

interface GalleryGridProps {
	images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{images.map((image) => (
					<div
						key={image._id}
						className="group relative bg-base-200 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
						onClick={() => setSelectedImage(image)}>
						{/* Image Container */}
						<div className="relative aspect-square w-full">
							<Image
								src={image.thumbnailUrl || image.imageUrl}
								alt={image.title}
								fill
								className="object-cover transition-transform duration-300 group-hover:scale-110"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							/>
							{/* Desktop overlay (md+): hidden by default and appears on hover */}
							<div className="hidden md:absolute md:inset-0 md:bg-black/0 md:group-hover:bg-black/50 md:flex md:items-center md:justify-center md:transition-colors md:duration-300">
								<div className="opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
									<h3 className="text-xl font-bold mb-2">{image.title}</h3>
									<p className="text-sm line-clamp-2">{image.description}</p>
								</div>
							</div>
						</div>
						{/* Mobile caption: shown below the image and hidden on md+ */}
						<div className="mt-3 md:hidden p-2">
							<h3 className="text-lg font-semibold text-base-content">{image.title}</h3>
							<p className="text-sm text-gray-600 line-clamp-3">{image.description}</p>
						</div>
					</div>
				))}
			</div>

			{/* Lightbox Modal */}
			{selectedImage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
					<div className="relative max-w-4xl w-full max-h-[90vh]">
						{/* Close Button */}
						<button
							onClick={() => setSelectedImage(null)}
							className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
							aria-label="Close image">
							<XIcon className="w-8 h-8" />
						</button>

						{/* Image */}
						<div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
							<Image
								src={selectedImage.imageUrl}
								alt={selectedImage.title}
								fill
								className="object-contain"
								sizes="(max-width: 1024px) 100vw, 80vw"
							/>
						</div>

						{/* Image Info */}
						<div className="mt-4 text-white text-center">
							<h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
							<p className="text-gray-300">{selectedImage.description}</p>
						</div>
					</div>

					{/* Background Click to Close */}
					<div className="absolute inset-0 -z-10" onClick={() => setSelectedImage(null)} />
				</div>
			)}
		</>
	);
}
