import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { getPresignedUploadUrl, getPublicUrl } from "@/lib/storage";

const ALLOWED_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
] as const;

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const body = await request.json();
		const { fileName, contentType } = body;

		if (!fileName || !contentType) {
			return NextResponse.json({ error: "fileName and contentType are required" }, { status: 400 });
		}

		if (!ALLOWED_TYPES.includes(contentType as (typeof ALLOWED_TYPES)[number])) {
			return NextResponse.json(
				{ error: "Invalid file type. Allowed: PDF, JPEG, PNG, WebP." },
				{ status: 400 }
			);
		}

		const fileExtension = fileName.includes(".") ? fileName.split(".").pop() : "";
		const safeExt = fileExtension && /^[a-zA-Z0-9]+$/.test(fileExtension) ? fileExtension : "bin";
		const key = `igil/certificates/${randomUUID()}.${safeExt}`;

		const uploadUrl = await getPresignedUploadUrl(key, contentType);

		return NextResponse.json({
			uploadUrl,
			key,
			url: getPublicUrl(key),
		});
	} catch (error) {
		console.error("Error generating certificate presigned URL:", error);
		return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
	}
}
