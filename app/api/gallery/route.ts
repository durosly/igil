import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { auth } from "@/lib/auth";

// GET - List all gallery images with pagination (public)
export async function GET(request: NextRequest) {
	try {
		await connectDB();

		// Get pagination parameters from query string
		const searchParams = request.nextUrl.searchParams;
		const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
		const limit = Math.min(12, Math.max(1, parseInt(searchParams.get("limit") || "12", 10))); // Max 12 items per page

		const skip = (page - 1) * limit;

		// Get total count for pagination metadata
		const total = await GalleryImage.countDocuments();

		// Fetch paginated images
		const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean();

		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			data: images,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
		});
	} catch (error) {
		console.error("Error fetching gallery images:", error);
		return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
	}
}

// POST - Create new gallery entry (admin only)
export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const body = await request.json();
		const { title, description, imageUrl, thumbnailUrl, order, fileSize } = body;

		if (!title || !description || !imageUrl) {
			return NextResponse.json({ error: "Title, description, and imageUrl are required" }, { status: 400 });
		}

		const image = new GalleryImage({
			title,
			description,
			imageUrl,
			thumbnailUrl,
			order: order || 0,
			fileSize: typeof fileSize === "number" ? fileSize : 0,
		});

		await image.save();

		return NextResponse.json(image, { status: 201 });
	} catch (error) {
		console.error("Error creating gallery image:", error);
		return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 });
	}
}
