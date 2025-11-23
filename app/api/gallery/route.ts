import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { auth } from "@/lib/auth";

// GET - List all gallery images (public)
export async function GET() {
	try {
		await connectDB();
		const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).lean();

		return NextResponse.json(images);
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
