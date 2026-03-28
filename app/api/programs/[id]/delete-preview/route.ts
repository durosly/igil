import { NextRequest, NextResponse } from "next/server";
import { getProgramDeletionImpactForAdmin } from "@/lib/admin/program-deletion";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const result = await getProgramDeletionImpactForAdmin(request.headers, id);
	if (!result.ok) {
		return NextResponse.json({ error: result.error }, { status: result.status });
	}
	return NextResponse.json(result.impact);
}
