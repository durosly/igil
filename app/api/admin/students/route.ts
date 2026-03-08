import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { sendInvitationEmail } from "@/lib/email";

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { data: listResponse, error } = await auth.api.listUsers({
			query: {
				filterField: "role",
				filterValue: "student",
				filterOperator: "eq",
				limit: 500,
			},
			headers: request.headers,
		});

		if (error) {
			return NextResponse.json({ error: error.message ?? "Failed to list users" }, { status: 500 });
		}

		const users = Array.isArray(listResponse)
			? listResponse
			: (listResponse as { users?: unknown[] })?.users ?? [];

		await connectDB();
		const enrollments = await Enrollment.find().lean();
		const byUser = new Map<string, typeof enrollments>();
		for (const e of enrollments) {
			const list = byUser.get(e.userId) ?? [];
			list.push(e);
			byUser.set(e.userId, list);
		}

		const list = (users as { id: string; name?: string; email?: string; role?: string }[]).map((u) => ({
			id: u.id,
			name: u.name,
			email: u.email,
			role: u.role,
			role: u.role,
			profileApproved: (u as { profileApproved?: boolean }).profileApproved,
			enrollments: byUser.get(u.id) ?? [],
		}));

		return NextResponse.json(list);
	} catch (error) {
		console.error("Error listing students:", error);
		return NextResponse.json({ error: "Failed to list students" }, { status: 500 });
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
