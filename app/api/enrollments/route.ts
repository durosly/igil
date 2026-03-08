import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if ((session.user as { role?: string }).role !== "student") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const body = await request.json();
		const { programId, sessionId } = body;

		if (!programId) {
			return NextResponse.json({ error: "programId is required" }, { status: 400 });
		}

		const existing = await Enrollment.findOne({
			userId: session.user.id,
			programId,
		});
		if (existing) {
			return NextResponse.json({ error: "Already enrolled in this program" }, { status: 400 });
		}

		const enrollment = await Enrollment.create({
			userId: session.user.id,
			programId,
			sessionId: sessionId || undefined,
			source: "self",
			profileApproved: false,
			programApproved: false,
			paymentApproved: false,
		});

		return NextResponse.json(enrollment, { status: 201 });
	} catch (error) {
		console.error("Error creating enrollment:", error);
		return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
	}
}
