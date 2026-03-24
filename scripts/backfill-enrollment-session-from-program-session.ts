#!/usr/bin/env npx tsx
/**
 * One-time migration: copy legacy ProgramSession.studentIds into Enrollment.sessionId,
 * then remove studentIds from program_sessions documents.
 *
 * Run after deploying enrollment-only session membership:
 *   npx tsx scripts/backfill-enrollment-session-from-program-session.ts
 *
 * Requires MONGODB_URI and MONGODB_NAME in .env.local (same as app).
 *
 * If the same user appears in studentIds on multiple sessions for the same program,
 * the last session processed wins for that enrollment's sessionId (order: natural collection order).
 * Check console for "multiple sessions" warnings.
 */

import path from "path";
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME || "igil_db";

type ProgramSessionDoc = {
	_id: ObjectId;
	programId: ObjectId;
	studentIds?: string[];
};

async function main() {
	if (!MONGODB_URI) {
		console.error("MONGODB_URI is required in .env.local");
		process.exit(1);
	}

	const client = new MongoClient(MONGODB_URI);
	await client.connect();
	const db = client.db(MONGODB_NAME);
	const sessions = db.collection<ProgramSessionDoc>("program_sessions");
	const enrollments = db.collection("enrollments");

	const docs = await sessions.find({ studentIds: { $exists: true } }).toArray();

	let withMembers = 0;
	const userProgramSeen = new Map<string, Set<string>>();

	for (const doc of docs) {
		const ids = Array.isArray(doc.studentIds) ? doc.studentIds : [];
		const programId = doc.programId;
		const sessionId = doc._id;

		if (ids.length > 0) {
			withMembers += 1;
		}

		for (const userId of ids) {
			if (typeof userId !== "string" || !userId) continue;

			const key = `${userId}:${programId.toHexString()}`;
			const seenSessions = userProgramSeen.get(key) ?? new Set<string>();
			if (seenSessions.size > 0) {
				console.warn(
					`User ${userId} was in studentIds on multiple sessions for program ${programId.toHexString()}; last write wins (now ${sessionId.toHexString()}).`
				);
			}
			seenSessions.add(sessionId.toHexString());
			userProgramSeen.set(key, seenSessions);

			const res = await enrollments.updateOne(
				{ userId, programId },
				{ $set: { sessionId } }
			);
			if (res.matchedCount === 0) {
				console.warn(
					`No enrollment for userId=${userId} programId=${programId.toHexString()} (session ${sessionId.toHexString()}) — skipped.`
				);
			}
		}

		await sessions.updateOne({ _id: doc._id }, { $unset: { studentIds: "" } });
	}

	await client.close();

	console.log(
		`Done. Cleared legacy studentIds on ${docs.length} program_sessions doc(s); ${withMembers} had non-empty lists.`
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
