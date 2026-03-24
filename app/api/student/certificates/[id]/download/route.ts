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

		const documentUrl = (cert as { documentUrl?: string }).documentUrl;
		if (!documentUrl) {
			return NextResponse.json(
				{ error: "Certificate document has not been uploaded yet." },
				{ status: 404 }
			);
		}

		let upstream: Response;
		try {
			upstream = await fetch(documentUrl, { cache: "no-store" });
		} catch {
			return NextResponse.json({ error: "Failed to retrieve certificate file" }, { status: 502 });
		}
		if (!upstream.ok) {
			return NextResponse.json({ error: "Certificate file unavailable" }, { status: 502 });
		}

		const buf = await upstream.arrayBuffer();
		await Certificate.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

		const rawName = (cert as { originalFileName?: string }).originalFileName;
		const fileName =
			rawName && rawName.trim().length > 0
				? rawName.replace(/["\r\n]/g, "_").slice(0, 200)
				: "certificate";
		const contentType =
			(cert as { contentType?: string }).contentType ||
			upstream.headers.get("content-type") ||
			"application/octet-stream";

		return new NextResponse(buf, {
			headers: {
				"Content-Type": contentType,
				"Content-Disposition": `attachment; filename="${fileName}"`,
			},
		});
	} catch (error) {
		console.error("Error downloading certificate:", error);
		return NextResponse.json({ error: "Failed to download" }, { status: 500 });
	}
}
