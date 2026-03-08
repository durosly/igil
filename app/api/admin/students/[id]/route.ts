import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getClient } from "@/lib/db";
import Enrollment from "@/models/Enrollment";

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

		const { id: userId } = await params;
		const body = await request.json();
		const { profileApproved, programApproved } = body;

		if (profileApproved !== undefined) {
			const db = await getClient();
			await db.collection("user").updateOne(
				{ id: userId },
				{ $set: { profileApproved: !!profileApproved } }
			);
		}

		if (programApproved !== undefined) {
			await connectDB();
			await Enrollment.updateMany(
				{ userId },
				{ $set: { programApproved: !!programApproved } }
			);
		}

		return NextResponse.json({ message: "Updated" });
	} catch (error) {
		console.error("Error updating student:", error);
		return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
	}
}
