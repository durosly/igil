import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ProgramSession from "@/models/ProgramSession";
import { auth } from "@/lib/auth";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const { id } = await params;
		const body = await request.json();
		const { title, year, studentIds } = body;

		const update: Record<string, unknown> = {};
		if (title !== undefined) update.title = title;
		if (year !== undefined) update.year = year;
		if (Array.isArray(studentIds)) update.studentIds = studentIds;

		const updated = await ProgramSession.findByIdAndUpdate(id, update, { new: true })
			.populate("programId", "title")
			.lean();
		if (!updated) {
			return NextResponse.json({ error: "Session not found" }, { status: 404 });
		}
		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating session:", error);
		return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
	}
}

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;
		const session = await ProgramSession.findById(id).populate("programId", "title").lean();
		if (!session) {
			return NextResponse.json({ error: "Session not found" }, { status: 404 });
		}
		return NextResponse.json(session);
	} catch (error) {
		console.error("Error fetching session:", error);
		return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
	}
}
