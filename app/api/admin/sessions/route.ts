import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ProgramSession from "@/models/ProgramSession";
import Enrollment from "@/models/Enrollment";
import { auth } from "@/lib/auth";
import { Types } from "mongoose";

export async function GET(request: NextRequest) {
	try {
		await connectDB();
		const programId = request.nextUrl.searchParams.get("programId");
		const filter = programId ? { programId } : {};
		const sessions = await ProgramSession.find(filter as never)
			.populate("programId", "title")
			.sort({ year: -1, createdAt: -1 })
			.lean();

		const sessionIds = sessions.map((s) => new Types.ObjectId(String(s._id)));
		const countBySession = new Map<string, number>();
		if (sessionIds.length > 0) {
			const grouped = await Enrollment.aggregate<{ _id: unknown; count: number }>([
				{ $match: { sessionId: { $in: sessionIds } } },
				{ $group: { _id: "$sessionId", count: { $sum: 1 } } },
			]);
			for (const row of grouped) {
				countBySession.set(String(row._id), row.count);
			}
		}

		const enriched = sessions.map((s) => ({
			...s,
			studentCount: countBySession.get(String(s._id)) ?? 0,
		}));

		return NextResponse.json(enriched);
	} catch (error) {
		console.error("Error fetching sessions:", error);
		return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
	}
}

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
		const { programId, year, title } = body;
		if (!programId || year == null || !title) {
			return NextResponse.json(
				{ error: "programId, year, and title are required" },
				{ status: 400 }
			);
		}

		const newSession = await ProgramSession.create({
			programId,
			year: Number(year),
			title: String(title).trim(),
		});
		const created = newSession.toObject();
		return NextResponse.json({ ...created, studentCount: 0 }, { status: 201 });
	} catch (error) {
		console.error("Error creating session:", error);
		return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
	}
}
