import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
	endpoint: process.env.R2_ENDPOINT!,
	region: process.env.R2_REGION || "auto",
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
	forcePathStyle: true,
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

/**
 * Generate a presigned URL for uploading an image
 * @param key - The S3 key (filename) for the object
 * @param contentType - The MIME type of the file
 * @param expiresIn - Expiration time in seconds (default: 15 minutes)
 * @returns Presigned URL for uploading
 */
export async function getPresignedUploadUrl(
	key: string,
	contentType: string,
	expiresIn: number = 15 * 60 // 15 minutes
): Promise<string> {
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
		ContentType: contentType,
	});

	return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a presigned URL for viewing/downloading an image
 * @param key - The S3 key (filename) for the object
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Presigned URL for viewing
 */
export async function getPresignedViewUrl(
	key: string,
	expiresIn: number = 60 * 60 // 1 hour
): Promise<string> {
	const command = new GetObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
	});

	return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete an object from S3
 * @param key - The S3 key (filename) for the object
 */
export async function deleteObject(key: string): Promise<void> {
	const command = new DeleteObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
	});

	await s3Client.send(command);
}

/**
 * Public URL for objects served via R2 custom domain (e.g. Cloudflare CDN).
 * Set R2_PUBLIC_BASE_URL in .env.local (no trailing slash), e.g. https://assets.igil.net
 */
export function getPublicUrl(key: string): string {
	const base = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "");
	if (!base) {
		throw new Error("R2_PUBLIC_BASE_URL is required (e.g. https://assets.igil.net)");
	}
	return `${base}/${key}`;
}

export { s3Client, BUCKET_NAME };
