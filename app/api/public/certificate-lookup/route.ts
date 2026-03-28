import { NextRequest, NextResponse } from "next/server";
import { lookupCertificatesByQuery } from "@/lib/public/certificate-verification-lookup";

export async function GET(request: NextRequest) {
	const q = request.nextUrl.searchParams.get("q") ?? "";
	const result = await lookupCertificatesByQuery(q);
	if (!result.ok) {
		return NextResponse.json({ error: result.error }, { status: result.status });
	}
	return NextResponse.json({ results: result.results });
}
