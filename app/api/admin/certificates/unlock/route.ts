import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import { auth } from "@/lib/auth";
import { addHours } from "date-fns";

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const body = await request.json();
		const { userId, programId, sessionId, completedAt, unlockHours } = body;

		if (!userId || !programId || !sessionId) {
			return NextResponse.json(
				{ error: "userId, programId, sessionId are required" },
				{ status: 400 }
			);
		}

		let cert = await Certificate.findOne({ userId, programId });
		const now = new Date();
		const completed = completedAt ? new Date(completedAt) : now;

		if (cert) {
			if (unlockHours) {
				cert.lastUnlockUntil = addHours(now, unlockHours);
				await cert.save();
			}
		} else {
			cert = await Certificate.create({
				userId,
				programId,
				sessionId,
				completedAt: completed,
				downloadCount: 0,
				...(unlockHours && { lastUnlockUntil: addHours(now, unlockHours) }),
			});
		}

		return NextResponse.json(cert);
	} catch (error) {
		console.error("Error creating/updating certificate:", error);
		return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
	}
}
