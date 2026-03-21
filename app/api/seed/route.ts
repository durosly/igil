import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/db";
import { hashPassword } from "better-auth/crypto";
import { ObjectId } from "mongodb";

/**
 * POST /api/seed
 * Creates an initial admin account when called with the correct SEED_SECRET.
 * Set SEED_SECRET in .env.local to enable. Use for initial setup only.
 *
 * Body: { secret: string, email?: string, name?: string, password?: string }
 * Env defaults: SEED_ADMIN_EMAIL, SEED_ADMIN_NAME, SEED_ADMIN_PASSWORD
 */
export async function POST(request: NextRequest) {
	try {
		const secret = process.env.SEED_SECRET;
		if (!secret) {
			return NextResponse.json(
				{ error: "Seed is not configured. Set SEED_SECRET in .env.local" },
				{ status: 500 }
			);
		}

		const body = await request.json().catch(() => ({}));
		const token = body.secret ?? request.headers.get("x-seed-secret") ?? "";

		if (token !== secret) {
			return NextResponse.json({ error: "Invalid or missing seed secret" }, { status: 401 });
		}

		const email = (body.email ?? process.env.SEED_ADMIN_EMAIL ?? "admin@igil.net").trim();
		const name = (body.name ?? process.env.SEED_ADMIN_NAME ?? "Admin").trim();
		const password = body.password ?? process.env.SEED_ADMIN_PASSWORD ?? "";

		if (!email || !password) {
			return NextResponse.json(
				{
					error:
						"Email and password required. Provide in body or set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.",
				},
				{ status: 400 }
			);
		}

		if (password.length < 8) {
			return NextResponse.json(
				{ error: "Password must be at least 8 characters" },
				{ status: 400 }
			);
		}

		const db = await getClient();
		const userCollection = db.collection("user");
		const accountCollection = db.collection("account");

		const existing = await userCollection.findOne({ email });
		if (existing) {
			const existingRole = (existing as { role?: string }).role;
			if (existingRole === "admin") {
				return NextResponse.json(
					{ message: "Admin user already exists", email: existing.email },
					{ status: 200 }
				);
			}
			return NextResponse.json(
				{ error: `User with email ${email} exists with role "${existingRole}". Cannot convert to admin via seed.` },
				{ status: 400 }
			);
		}

		const userId = new ObjectId().toString();
		const now = new Date();
		const hashedPassword = await hashPassword(password);

		const userDoc = {
			_id: new ObjectId(userId),
			id: userId,
			email,
			emailVerified: true,
			name: name || email,
			image: null,
			createdAt: now,
			updatedAt: now,
			role: "admin",
		};

		const accountId = new ObjectId().toString();
		const accountDoc = {
			_id: new ObjectId(accountId),
			id: accountId,
			userId,
			accountId: userId,
			providerId: "credential",
			password: hashedPassword,
		};

		await userCollection.insertOne(userDoc);
		await accountCollection.insertOne(accountDoc);

		return NextResponse.json(
			{
				message: "Admin account created successfully",
				email,
				name: userDoc.name,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Seed error:", error);
		return NextResponse.json({ error: "Failed to seed admin" }, { status: 500 });
	}
}
