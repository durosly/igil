import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
import { auth } from "@/lib/auth";
import { deleteObject } from "@/lib/storage";

// GET - Get single image details (public)
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		await connectDB();

		const image = await GalleryImage.findById(id).lean();

		if (!image) {
			return NextResponse.json(
				{ error: "Image not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(image);
	} catch (error) {
		console.error("Error fetching gallery image:", error);
		return NextResponse.json(
			{ error: "Failed to fetch gallery image" },
			{ status: 500 }
		);
	}
}

// PUT - Update image (admin only)
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { id } = await params;
		await connectDB();

		const body = await request.json();
		const { title, description, imageUrl, thumbnailUrl, order } = body;

		const image = await GalleryImage.findById(id);

		if (!image) {
			return NextResponse.json(
				{ error: "Image not found" },
				{ status: 404 }
			);
		}

		// Update fields
		if (title !== undefined) image.title = title;
		if (description !== undefined) image.description = description;
		if (imageUrl !== undefined) image.imageUrl = imageUrl;
		if (thumbnailUrl !== undefined) image.thumbnailUrl = thumbnailUrl;
		if (order !== undefined) image.order = order;

		await image.save();

		return NextResponse.json(image);
	} catch (error) {
		console.error("Error updating gallery image:", error);
		return NextResponse.json(
			{ error: "Failed to update gallery image" },
			{ status: 500 }
		);
	}
}

// DELETE - Delete image (admin only)
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { id } = await params;
		await connectDB();

		const image = await GalleryImage.findById(id);

		if (!image) {
			return NextResponse.json(
				{ error: "Image not found" },
				{ status: 404 }
			);
		}

		// Extract key from imageUrl (assuming it's the filename)
		try {
			const imageUrl = new URL(image.imageUrl);
			const key = imageUrl.pathname.substring(1); // Remove leading slash
			await deleteObject(key);
		} catch (deleteError) {
			console.error("Error deleting from storage:", deleteError);
			// Continue with database deletion even if storage deletion fails
		}

		await GalleryImage.findByIdAndDelete(id);

		return NextResponse.json({ message: "Image deleted successfully" });
	} catch (error) {
		console.error("Error deleting gallery image:", error);
		return NextResponse.json(
			{ error: "Failed to delete gallery image" },
			{ status: 500 }
		);
	}
}
