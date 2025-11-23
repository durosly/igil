import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
	endpoint: process.env.TEBI_ENDPOINT!,
	region: process.env.TEBI_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.TEBI_ACCESS_KEY_ID!,
		secretAccessKey: process.env.TEBI_SECRET_ACCESS_KEY!,
	},
	forcePathStyle: true,
});

const BUCKET_NAME = process.env.TEBI_BUCKET_NAME!;

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
 * Get the public URL for an object (if bucket is public)
 * @param key - The S3 key (filename) for the object
 * @returns Public URL
 */
export function getPublicUrl(key: string): string {
	const endpoint = process.env.TEBI_ENDPOINT!.replace(/^https?:\/\//, "");
	return `https://${BUCKET_NAME}.${endpoint}/${key}`;
}

export { s3Client, BUCKET_NAME };
