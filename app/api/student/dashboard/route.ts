import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import PaymentCode from "@/models/PaymentCode";
import Program from "@/models/Program";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const userId = session.user.id;

		await connectDB();
		const [enrollments, paymentCodes, programs] = await Promise.all([
			Enrollment.find({ userId })
				.populate("programId", "title paymentInstruction status")
				.populate("sessionId", "title year")
				.lean(),
			PaymentCode.find({ userId }).populate("programId", "title").lean(),
			Program.find({ status: "active" }).select("_id title").lean(),
		]);

		return NextResponse.json({
			enrollments,
			paymentCodes,
			programs,
		});
	} catch (error) {
		console.error("Error fetching student dashboard:", error);
		return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
	}
}
