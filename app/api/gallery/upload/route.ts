import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/storage";
import { randomUUID } from "crypto";

// POST - Generate presigned upload URL (admin only)
export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { fileName, contentType } = body;

		if (!fileName || !contentType) {
			return NextResponse.json({ error: "fileName and contentType are required" }, { status: 400 });
		}

		// Validate file type
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

		if (!allowedTypes.includes(contentType)) {
			return NextResponse.json(
				{ error: "Invalid file type. Only images are allowed." },
				{ status: 400 }
			);
		}

		// Generate unique key for the file
		const fileExtension = fileName.split(".").pop();
		const key = `igil/gallery/${randomUUID()}.${fileExtension}`;

		// Generate presigned URL
		const uploadUrl = await getPresignedUploadUrl(key, contentType);

		return NextResponse.json({
			uploadUrl,
			key,
			url: uploadUrl.split("?")[0], // Return the base URL without query params
		});
	} catch (error) {
		console.error("Error generating presigned URL:", error);
		return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
	}
}
