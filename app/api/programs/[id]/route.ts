import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Program from "@/models/Program";
import { auth } from "@/lib/auth";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;
		const program = await Program.findById(id).lean();
		if (!program) {
			return NextResponse.json({ error: "Program not found" }, { status: 404 });
		}
		return NextResponse.json(program);
	} catch (error) {
		console.error("Error fetching program:", error);
		return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
	}
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
		const userRole = (session.user as { role?: string }).role;
		if (userRole !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const { id } = await params;
		const body = await request.json();
		const { title, description, coverImageUrl, paymentInstruction, status } = body;

		const program = await Program.findByIdAndUpdate(
			id,
			{
				...(title !== undefined && { title }),
				...(description !== undefined && { description }),
				...(coverImageUrl !== undefined && { coverImageUrl }),
				...(paymentInstruction !== undefined && { paymentInstruction }),
				...(status !== undefined && { status }),
			},
			{ new: true }
		).lean();

		if (!program) {
			return NextResponse.json({ error: "Program not found" }, { status: 404 });
		}
		return NextResponse.json(program);
	} catch (error) {
		console.error("Error updating program:", error);
		return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await auth.api.getSession({ headers: _request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const userRole = (session.user as { role?: string }).role;
		if (userRole !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const { id } = await params;
		const program = await Program.findByIdAndDelete(id);
		if (!program) {
			return NextResponse.json({ error: "Program not found" }, { status: 404 });
		}
		return NextResponse.json({ message: "Deleted" });
	} catch (error) {
		console.error("Error deleting program:", error);
		return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
	}
}
