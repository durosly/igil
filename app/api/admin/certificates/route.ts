import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import { auth } from "@/lib/auth";
import { addHours } from "date-fns";

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const completedEnrollments = await Enrollment.find({ completedAt: { $ne: null } })
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.lean();

		const certificates = await Certificate.find()
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.lean();

		return NextResponse.json({ certificates });
	} catch (error) {
		console.error("Error listing certificates:", error);
		return NextResponse.json({ error: "Failed to list certificates" }, { status: 500 });
	}
}
