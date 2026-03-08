import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import { auth } from "@/lib/auth";
import { isAfter } from "date-fns";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await auth.api.getSession({ headers: _request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const { id } = await params;
		const cert = await Certificate.findById(id).lean();
		if (!cert) {
			return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
		}
		if ((cert as { userId: string }).userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const downloadCount = (cert as { downloadCount: number }).downloadCount ?? 0;
		const lastUnlockUntil = (cert as { lastUnlockUntil?: Date }).lastUnlockUntil;
		const canDownload =
			downloadCount === 0 || (lastUnlockUntil && isAfter(new Date(lastUnlockUntil), new Date()));

		if (!canDownload) {
			return NextResponse.json(
				{ error: "Re-download requires payment. Contact admin to unlock." },
				{ status: 403 }
			);
		}

		await Certificate.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

		// Placeholder: return a simple HTML page or redirect to a static placeholder PDF
		// In production you would generate or serve the actual certificate file
		return new NextResponse(
			"<html><body><p>Certificate download would be served here. Configure certificate file storage or generation.</p></body></html>",
			{
				headers: {
					"Content-Type": "text/html",
					"Content-Disposition": "inline",
				},
			}
		);
	} catch (error) {
		console.error("Error downloading certificate:", error);
		return NextResponse.json({ error: "Failed to download" }, { status: 500 });
	}
}
