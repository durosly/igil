import { NextRequest, NextResponse } from "next/server";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { betterAuthUserIdFilter } from "@/lib/admin/better-auth-user-filter";
import connectDB from "@/lib/db";
import { getClient } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import PaymentCode from "@/models/PaymentCode";
import { deleteObject } from "@/lib/storage";
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

export async function DELETE(
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

		const { id: targetUserId } = await params;

		const lookup = await getStudentForAdmin(request.headers, targetUserId);
		if (!lookup.ok) {
			return NextResponse.json({ error: lookup.error }, { status: lookup.status });
		}

		if (session.user.id === lookup.student.id) {
			return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
		}

		await connectDB();

		const certs = await Certificate.find({ userId: targetUserId }).lean();
		for (const c of certs) {
			const key = c.storageKey;
			if (typeof key === "string" && key.length > 0) {
				await deleteObject(key);
			}
		}

		await Certificate.deleteMany({ userId: targetUserId });
		await Enrollment.deleteMany({ userId: targetUserId });
		await PaymentCode.deleteMany({ userId: targetUserId });

		await auth.api.removeUser({
			body: { userId: lookup.student.id },
			headers: request.headers,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting student:", error);
		if (error instanceof APIError) {
			return NextResponse.json(
				{ error: error.message || "Failed to remove user" },
				{ status: 400 }
			);
		}
		return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
	}
}
