import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const certificates = await Certificate.find({ userId: session.user.id })
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.lean();

		return NextResponse.json({ certificates });
	} catch (error) {
		console.error("Error fetching certificates:", error);
		return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
	}
}
