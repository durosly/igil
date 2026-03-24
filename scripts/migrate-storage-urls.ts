#!/usr/bin/env npx tsx
/**
 * Rewrite stored media URLs from Tebi S3 public URLs to Cloudflare R2 (custom domain).
 *
 * Default mapping:
 *   https://s3.tebi.io/idan/  →  https://assets.igil.net/
 * Example:
 *   https://s3.tebi.io/idan/igil/gallery/foo.jpeg
 *   → https://assets.igil.net/igil/gallery/foo.jpeg
 *
 * Collections (Mongoose defaults):
 *   galleryimages — imageUrl, thumbnailUrl
 *   programs      — coverImageUrl
 *
 * Env (.env.local):
 *   MONGODB_URI, MONGODB_NAME
 *   URL_MIGRATE_OLD_PREFIX — override old prefix (default https://s3.tebi.io/idan/)
 *   URL_MIGRATE_NEW_PREFIX — override new prefix (default https://assets.igil.net/)
 *
 * Usage:
 *   npx tsx scripts/migrate-storage-urls.ts --dry-run
 *   npx tsx scripts/migrate-storage-urls.ts
 */
import path from "path";
import { config } from "dotenv";
import { MongoClient, type Document } from "mongodb";

config({ path: path.resolve(process.cwd(), ".env.local") });

const dryRun = process.argv.includes("--dry-run");

const OLD_PREFIX =
	process.env.URL_MIGRATE_OLD_PREFIX ?? "https://s3.tebi.io/idan/";
const NEW_PREFIX =
	process.env.URL_MIGRATE_NEW_PREFIX ?? "https://assets.igil.net/";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME || "igil_db";

type FieldSpec = { collection: string; fields: string[] };

const TARGETS: FieldSpec[] = [
	{ collection: "galleryimages", fields: ["imageUrl", "thumbnailUrl"] },
	{ collection: "programs", fields: ["coverImageUrl"] },
];

function rewriteUrl(value: unknown): string | null {
	if (typeof value !== "string" || !value.includes(OLD_PREFIX)) {
		return null;
	}
	return value.split(OLD_PREFIX).join(NEW_PREFIX);
}

function collectUpdates(doc: Document, fields: string[]): Record<string, string> | null {
	const $set: Record<string, string> = {};
	for (const f of fields) {
		const next = rewriteUrl(doc[f]);
		if (next !== null) {
			$set[f] = next;
		}
	}
	return Object.keys($set).length ? $set : null;
}

async function migrateCollection(
	client: MongoClient,
	spec: FieldSpec
): Promise<{ matched: number; updated: number }> {
	const coll = client.db(MONGODB_NAME).collection(spec.collection);

	const orClause = spec.fields.map((f) => ({
		[f]: { $regex: OLD_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") },
	}));

	const cursor = coll.find({ $or: orClause });
	const docs = await cursor.toArray();

	let updated = 0;
	type BulkWriteOp = Parameters<typeof coll.bulkWrite>[0][number];
	const ops: BulkWriteOp[] = [];

	for (const doc of docs) {
		const $set = collectUpdates(doc, spec.fields);
		if (!$set) continue;
		updated++;
		if (dryRun) {
			console.log(
				`  [${spec.collection}] ${String(doc._id)}: ${JSON.stringify($set)}`
			);
			continue;
		}
		ops.push({
			updateOne: {
				filter: { _id: doc._id },
				update: { $set },
			},
		});
	}

	if (!dryRun && ops.length > 0) {
		await coll.bulkWrite(ops);
	}

	return { matched: docs.length, updated };
}

async function main() {
	if (!MONGODB_URI) {
		console.error("Missing MONGODB_URI in .env.local");
		process.exit(1);
	}

	console.log(
		dryRun
			? "Dry run — no writes."
			: "Applying URL rewrites to MongoDB."
	);
	console.log(`Database: ${MONGODB_NAME}`);
	console.log(`Replace:  ${OLD_PREFIX}`);
	console.log(`With:     ${NEW_PREFIX}`);

	const client = new MongoClient(MONGODB_URI);
	await client.connect();

	try {
		let totalUpdated = 0;
		for (const spec of TARGETS) {
			const { matched, updated } = await migrateCollection(client, spec);
			console.log(
				`${spec.collection}: scanned ${matched} doc(s), ${dryRun ? "would update" : "updated"} ${updated}`
			);
			totalUpdated += updated;
		}
		console.log(
			dryRun
				? `\nDone (dry run). ${totalUpdated} document(s) would be modified.`
				: `\nDone. ${totalUpdated} document(s) modified.`
		);
	} finally {
		await client.close();
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
