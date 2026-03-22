#!/usr/bin/env npx tsx
/**
 * Copy all objects from Tebi S3-compatible storage to Cloudflare R2.
 *
 * Reads credentials from .env.local (same variables as the app):
 *   Source: TEBI_ENDPOINT, TEBI_REGION, TEBI_ACCESS_KEY_ID, TEBI_SECRET_ACCESS_KEY, TEBI_BUCKET_NAME
 *   Dest:   R2_ENDPOINT, R2_REGION, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *
 * Optional:
 *   MIGRATE_PREFIX     — only copy keys starting with this prefix (e.g. "gallery/")
 *   MIGRATE_CONCURRENCY — parallel copies (default 6)
 *
 * Usage:
 *   npx tsx scripts/migrate-tebi-to-r2.ts           # run migration
 *   npx tsx scripts/migrate-tebi-to-r2.ts --dry-run
 */
import path from "path";
import { config } from "dotenv";
import {
	S3Client,
	ListObjectsV2Command,
	GetObjectCommand,
	PutObjectCommand,
	HeadObjectCommand,
} from "@aws-sdk/client-s3";

config({ path: path.resolve(process.cwd(), ".env.local") });

const dryRun = process.argv.includes("--dry-run");

function requireEnv(name: string): string {
	const v = process.env[name];
	if (!v) {
		console.error(`Missing required env: ${name} (in .env.local)`);
		process.exit(1);
	}
	return v;
}

const tebiClient = new S3Client({
	endpoint: requireEnv("TEBI_ENDPOINT"),
	region: process.env.TEBI_REGION || "us-east-1",
	credentials: {
		accessKeyId: requireEnv("TEBI_ACCESS_KEY_ID"),
		secretAccessKey: requireEnv("TEBI_SECRET_ACCESS_KEY"),
	},
	forcePathStyle: true,
});

const r2Client = new S3Client({
	endpoint: requireEnv("R2_ENDPOINT"),
	region: process.env.R2_REGION || "auto",
	credentials: {
		accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
		secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
	},
	forcePathStyle: true,
});

const sourceBucket = requireEnv("TEBI_BUCKET_NAME");
const destBucket = requireEnv("R2_BUCKET_NAME");
const keyPrefix = process.env.MIGRATE_PREFIX || "";
const concurrency = Math.max(
	1,
	Math.min(32, parseInt(process.env.MIGRATE_CONCURRENCY || "6", 10) || 6)
);

async function listAllKeys(): Promise<{ key: string; size: number }[]> {
	const out: { key: string; size: number }[] = [];
	let token: string | undefined;

	do {
		const res = await tebiClient.send(
			new ListObjectsV2Command({
				Bucket: sourceBucket,
				Prefix: keyPrefix || undefined,
				ContinuationToken: token,
			})
		);
		for (const obj of res.Contents ?? []) {
			if (obj.Key !== undefined && obj.Size !== undefined) {
				out.push({ key: obj.Key, size: obj.Size });
			}
		}
		token = res.IsTruncated ? res.NextContinuationToken : undefined;
	} while (token);

	return out;
}

async function objectExistsOnDest(key: string): Promise<boolean> {
	try {
		await r2Client.send(
			new HeadObjectCommand({ Bucket: destBucket, Key: key })
		);
		return true;
	} catch {
		return false;
	}
}

async function copyOne(key: string): Promise<void> {
	const get = await tebiClient.send(
		new GetObjectCommand({ Bucket: sourceBucket, Key: key })
	);

	// R2 rejects streaming puts without a known length (x-amz-decoded-content-length).
	// Buffer the object so PutObject sends a fixed Content-Length body.
	const body = get.Body
		? await get.Body.transformToByteArray()
		: new Uint8Array();

	await r2Client.send(
		new PutObjectCommand({
			Bucket: destBucket,
			Key: key,
			Body: body,
			ContentLength: body.byteLength,
			ContentType: get.ContentType,
			ContentEncoding: get.ContentEncoding,
			CacheControl: get.CacheControl,
			ContentDisposition: get.ContentDisposition,
			Metadata: get.Metadata,
		})
	);
}

async function runPool<T>(
	items: T[],
	limit: number,
	fn: (item: T) => Promise<void>
): Promise<void> {
	let index = 0;
	async function worker(): Promise<void> {
		for (;;) {
			const i = index++;
			if (i >= items.length) return;
			await fn(items[i]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
}

async function main() {
	console.log(
		dryRun
			? "Dry run — listing source only, no uploads."
			: `Migrating s3://${sourceBucket}/ → s3://${destBucket}/`
	);
	if (keyPrefix) console.log(`Prefix filter: "${keyPrefix}"`);
	console.log(`Concurrency: ${concurrency}`);

	const objects = await listAllKeys();
	console.log(`Found ${objects.length} object(s).`);

	if (dryRun) {
		let bytes = 0;
		for (const o of objects) bytes += o.size;
		console.log(`Total size (approx): ${(bytes / (1024 * 1024)).toFixed(2)} MiB`);
		return;
	}

	let copied = 0;
	let skipped = 0;
	const errors: { key: string; message: string }[] = [];

	await runPool(objects, concurrency, async ({ key }) => {
		try {
			const exists = await objectExistsOnDest(key);
			if (exists) {
				skipped++;
				return;
			}
			await copyOne(key);
			copied++;
			if ((copied + skipped) % 50 === 0 || copied + skipped === objects.length) {
				process.stdout.write(`\rProgress: ${copied + skipped}/${objects.length} (copied ${copied}, skipped ${skipped})`);
			}
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			errors.push({ key, message });
		}
	});

	console.log(
		`\nDone. Copied: ${copied}, skipped (already on R2): ${skipped}, errors: ${errors.length}`
	);
	if (errors.length) {
		console.error("Failures:");
		for (const { key, message } of errors.slice(0, 20)) {
			console.error(`  ${key}: ${message}`);
		}
		if (errors.length > 20) {
			console.error(`  ... and ${errors.length - 20} more`);
		}
		process.exit(1);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
