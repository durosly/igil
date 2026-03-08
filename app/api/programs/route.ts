import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Program from "@/models/Program";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
	try {
		await connectDB();
		const searchParams = request.nextUrl.searchParams;
		const status = searchParams.get("status");
		const forPublic = searchParams.get("public") === "true";

		const filter: Record<string, unknown> = {};
		if (status) filter.status = status;
		if (forPublic) filter.status = "active";

		const programs = await Program.find(filter).sort({ createdAt: -1 }).lean();
		return NextResponse.json(programs);
	} catch (error) {
		console.error("Error fetching programs:", error);
		return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const userRole = (session.user as { role?: string }).role;
		if (userRole !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const body = await request.json();
		const { title, description, coverImageUrl, paymentInstruction, status } = body;

		if (!title || !description) {
			return NextResponse.json(
				{ error: "Title and description are required" },
				{ status: 400 }
			);
		}

		const program = await Program.create({
			title,
			description,
			coverImageUrl: coverImageUrl ?? undefined,
			paymentInstruction: paymentInstruction ?? undefined,
			status: status ?? "draft",
		});

		return NextResponse.json(program, { status: 201 });
	} catch (error) {
		console.error("Error creating program:", error);
		return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
	}
}
