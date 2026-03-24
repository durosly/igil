import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { betterAuthUserIdFilter } from "@/lib/admin/better-auth-user-filter";
import connectDB from "@/lib/db";
import { getClient } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { getStudentForAdmin } from "@/lib/admin/get-student-for-admin";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const result = await getStudentForAdmin(request.headers, id);
	if (!result.ok) {
		return NextResponse.json({ error: result.error }, { status: result.status });
	}
	return NextResponse.json(result.student);
}

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
			await db.collection("user").updateOne(betterAuthUserIdFilter(userId), {
				$set: { profileApproved: !!profileApproved },
			});
			await connectDB();
			await Enrollment.updateMany(
				{ userId },
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
