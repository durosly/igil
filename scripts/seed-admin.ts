#!/usr/bin/env npx tsx
/**
 * Seed admin account for IGIL.
 * Run: npm run seed
 *
 * Uses SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME from .env.local
 * Requires MONGODB_URI and MONGODB_NAME in .env.local
 */
import path from "path";
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { hashPassword } from "better-auth/crypto";

config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME || "igil_db";
const email = process.env.SEED_ADMIN_EMAIL || "admin@igil.net";
const name = process.env.SEED_ADMIN_NAME || "Admin";
const password = process.env.SEED_ADMIN_PASSWORD;

async function main() {
	if (!MONGODB_URI) {
		console.error("❌ MONGODB_URI is required in .env.local");
		process.exit(1);
	}
	if (!password) {
		console.error("❌ SEED_ADMIN_PASSWORD is required in .env.local");
		process.exit(1);
	}
	if (password.length < 8) {
		console.error("❌ SEED_ADMIN_PASSWORD must be at least 8 characters");
		process.exit(1);
	}

	const client = new MongoClient(MONGODB_URI);
	await client.connect();
	const db = client.db(MONGODB_NAME);

	const userCollection = db.collection("user");
	const accountCollection = db.collection("account");

	const existing = await userCollection.findOne({ email });
	if (existing) {
		const role = (existing as { role?: string }).role;
		if (role === "admin") {
			console.log("✅ Admin user already exists:", email);
			await client.close();
			process.exit(0);
		}
		console.error(
			`❌ User ${email} already exists (role: ${role ?? "not set"}). Delete the user or use a different SEED_ADMIN_EMAIL.`
		);
		await client.close();
		process.exit(1);
	}

	const userId = new ObjectId().toString();
	const now = new Date();
	const hashedPassword = await hashPassword(password);

	const userDoc = {
		_id: new ObjectId(userId),
		id: userId,
		email,
		emailVerified: true,
		name: name.trim() || email,
		image: null,
		createdAt: now,
		updatedAt: now,
		role: "admin",
	};

	const accountId = new ObjectId().toString();
	const accountDoc = {
		_id: new ObjectId(accountId),
		// id: accountId,
		userId: new ObjectId(userId),
		accountId: userId,
		providerId: "credential",
		password: hashedPassword,
	};

	await userCollection.insertOne(userDoc);
	await accountCollection.insertOne(accountDoc);

	console.log("✅ Admin account created:", email);
	await client.close();
}

main().catch((err) => {
	console.error("❌ Seed failed:", err);
	process.exit(1);
});
