import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Program from "@/models/Program";

export async function GET(request: NextRequest) {
	try {
		await connectDB();
		const programs = await Program.find({ status: "active" }).sort({ title: 1 }).lean();
		return NextResponse.json(programs);
	} catch (error) {
		console.error("Error fetching programs:", error);
		return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
	}
}
