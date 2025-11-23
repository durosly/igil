import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";

let envPath = ".env.local";
if (process.env.NODE_ENV === "production") {
	envPath = path.resolve(process.cwd(), ".vercel/env.production.local");
}

config({ path: envPath });

if (!process.env.MONGODB_URI) {
	throw new Error("Please add your MONGODB_URI to .env.local");
}

const MONGODB_URI: string = process.env.MONGODB_URI;

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
	global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongoose) => {
				console.log("✅ MongoDB connected successfully");
				return mongoose;
			})
			.catch((err) => {
				console.error("❌ MongoDB connection error:", err);
				throw err;
			});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export async function getClient() {
	const conn = await connectDB();
	return conn.connection.getClient().db(process.env.MONGODB_NAME);
}

export default connectDB;
