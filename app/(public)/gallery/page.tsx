import type { Metadata } from "next";
import GalleryGrid from "./components/gallery-grid";
import connectDB from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Gallery",
	description: "View our gallery of images showcasing our work and services.",
	openGraph: {
		title: "Gallery - IDAN GLOBAL INTEGRATED LIMITED",
		description: "View our gallery of images showcasing our work and services.",
		url: "https://igil.net/gallery",
	},
};

type Props = {
	searchParams?: { [key: string]: string | string[] | undefined } | Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 9; // images per page

type GalleryImageDTO = {
	_id: string;
	title: string;
	description: string;
	imageUrl: string;
	thumbnailUrl?: string;
	order?: number;
	fileSize?: number;
	createdAt?: string;
	updatedAt?: string;
};

export default async function GalleryPage({ searchParams }: Props) {
	// Unwrap searchParams if it's a Promise (Next may pass a promise)
	const sp = await Promise.resolve(searchParams || {});

	// Determine current page from query string. Support disabling pagination with `?page=all` or `?paginate=false`.
	const pageParamRaw = Array.isArray(sp?.page) ? sp.page[0] : sp?.page;
	const paginateParamRaw = Array.isArray(sp?.paginate) ? sp.paginate[0] : sp?.paginate;

	const disablePagination = pageParamRaw === "all" || String(paginateParamRaw) === "false" || String(paginateParamRaw) === "0";

	let page = 1;
	if (!disablePagination && pageParamRaw) {
		const n = parseInt(String(pageParamRaw), 10);
		if (!isNaN(n) && n > 0) page = n;
	}

	let images: GalleryImageDTO[] = [];
	let totalImages = 0;

	try {
		await connectDB();

		// Total count for pagination
		totalImages = await GalleryImage.countDocuments();

		// Fetch images. If pagination is disabled, fetch all, otherwise fetch a page.
		let docs;
		if (disablePagination) {
			docs = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).lean();
		} else {
			docs = await GalleryImage.find()
				.sort({ order: 1, createdAt: -1 })
				.skip((page - 1) * PAGE_SIZE)
				.limit(PAGE_SIZE)
				.lean();
		}

		images = (docs as unknown as Array<Record<string, unknown>>).map((doc) => {
			const d = doc as Record<string, unknown>;
			return {
				_id: d._id ? String(d._id) : "",
				title: d.title ? String(d.title) : "",
				description: d.description ? String(d.description) : "",
				imageUrl: d.imageUrl ? String(d.imageUrl) : "",
				thumbnailUrl: d.thumbnailUrl ? String(d.thumbnailUrl) : undefined,
				order: typeof d.order === "number" ? (d.order as number) : typeof d.order === "string" ? parseInt(String(d.order), 10) : undefined,
				fileSize: typeof d.fileSize === "number" ? (d.fileSize as number) : typeof d.fileSize === "string" ? parseInt(String(d.fileSize), 10) : undefined,
				createdAt: d.createdAt ? new Date(String(d.createdAt)).toISOString() : undefined,
				updatedAt: d.updatedAt ? new Date(String(d.updatedAt)).toISOString() : undefined,
			} as GalleryImageDTO;
		});
	} catch (error) {
		console.error("Error fetching gallery images from DB:", error);
	}

	const totalPages = disablePagination ? 1 : Math.max(1, Math.ceil(totalImages / PAGE_SIZE));

	return (
		<main className="min-h-screen">
			{/* Header Section */}
			<section className="py-20 bg-gradient-to-br from-red-50 to-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex items-center justify-center gap-2 mb-4">
						<div className="w-12 h-0.5 bg-primary"></div>
						<span className="text-primary font-semibold tracking-wider uppercase text-sm">OUR GALLERY</span>
						<div className="w-12 h-0.5 bg-primary"></div>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold mb-6">Image Gallery</h1>
					<p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-700">
						Explore our collection of images showcasing our services, projects, and expertise in Non-Destructive Testing.
					</p>
				</div>
			</section>

			{/* Gallery Grid Section */}
			<section className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{images.length > 0 ? (
						<>
							<GalleryGrid images={images} />

							{/* Pagination using DaisyUI (hidden when pagination is disabled or there's only 1 page) */}
							{!disablePagination && totalPages > 1 && (
								<div className="flex justify-center mt-8">
									<ul className="join">
										{/* Prev */}
										{page <= 1 ? (
											<button className="btn btn-ghost join-item">«</button>
										) : (
											<Link
												href={page > 1 ? `/gallery?page=${page - 1}` : "#"}
												className="btn btn-ghost join-item">
												«
											</Link>
										)}

										{/* Page numbers (show up to 7 with truncation) */}
										{Array.from({ length: totalPages }).map((_, i) => {
											const pageNum = i + 1;
											// Simple truncation: show first, last, current +/-1
											const show =
												pageNum === 1 ||
												pageNum === totalPages ||
												Math.abs(pageNum - page) <= 1 ||
												(page <= 3 && pageNum <= 5) ||
												(page >= totalPages - 2 && pageNum >= totalPages - 4);

											if (!show) {
												// Render nothing for skipped pages (simpler)
												return null;
											}

											return (
												<button key={i} className="btn btn-ghost join-item">
													{pageNum}
												</button>
											);
										})}

										{/* Next */}
										{page >= totalPages ? (
											<button className="btn btn-ghost join-item" disabled>
												»
											</button>
										) : (
											<Link
												href={page < totalPages ? `/gallery?page=${page + 1}` : "#"}
												className="btn btn-ghost join-item">
												»
											</Link>
										)}
									</ul>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-20">
							<p className="text-xl text-gray-600">No images available yet. Check back soon!</p>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
