import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { sendInvitationEmail } from "@/lib/email";
import { listStudentsForAdmin } from "@/lib/admin/list-students-for-admin";

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
	const result = await listStudentsForAdmin(request.headers);
	if (!result.ok) {
		return NextResponse.json({ error: result.error }, { status: result.status });
	}
	return NextResponse.json(result.students);
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

		const body = await request.json();
		const { email, name, password, programId, sessionId, sendInvite } = body;

		if (!email || !name || !password) {
			return NextResponse.json(
				{ error: "Email, name, and password are required" },
				{ status: 400 }
			);
		}

		const { data: newUser, error: createError } = await auth.api.createUser({
			body: {
				email: String(email).trim(),
				name: String(name).trim(),
				password: String(password),
				role: "student",
				data: {
					mustChangePassword: true,
					profileApproved: false,
				},
			},
			headers: request.headers,
		});

		if (createError || !newUser) {
			return NextResponse.json(
				{ error: (createError as { message?: string })?.message ?? "Failed to create user" },
				{ status: 400 }
			);
		}

		if (programId) {
			await connectDB();
			await Enrollment.create({
				userId: newUser.id,
				programId,
				sessionId: sessionId || undefined,
				source: "invited",
				profileApproved: false,
				programApproved: false,
				paymentApproved: false,
			});
		}

		if (sendInvite) {
			const setPasswordUrl = `${baseURL}/login`;
			await sendInvitationEmail({
				to: newUser.email!,
				recipientName: newUser.name ?? newUser.email!,
				programName: body.programName ?? "the program",
				tempPassword: password,
				setPasswordUrl,
			});
		}

		return NextResponse.json(newUser, { status: 201 });
	} catch (error) {
		console.error("Error creating student:", error);
		return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
	}
}
