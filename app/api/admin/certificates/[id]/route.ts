import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";

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

		const { id } = await params;
		const body = await request.json();

		const allowedKeys = [
			"documentUrl",
			"storageKey",
			"contentType",
			"originalFileName",
			"certificateNumber",
			"issuedAt",
		] as const;

		const $set: Record<string, unknown> = {};
		const $unset: Record<string, 1> = {};

		for (const k of allowedKeys) {
			if (!Object.prototype.hasOwnProperty.call(body, k)) continue;
			const v = body[k];
			if (k === "issuedAt") {
				if (v === null || v === "") {
					$unset.issuedAt = 1;
				} else {
					const d = new Date(v);
					if (Number.isNaN(d.getTime())) {
						return NextResponse.json({ error: "Invalid issuedAt" }, { status: 400 });
					}
					$set.issuedAt = d;
				}
				continue;
			}
			if (v === null || v === "") {
				$unset[k] = 1;
			} else if (typeof v === "string") {
				$set[k] = v;
			} else {
				return NextResponse.json({ error: `Invalid value for ${k}` }, { status: 400 });
			}
		}

		if (Object.keys($set).length === 0 && Object.keys($unset).length === 0) {
			return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
		}

		await connectDB();
		const updateOp: { $set?: typeof $set; $unset?: typeof $unset } = {};
		if (Object.keys($set).length) updateOp.$set = $set;
		if (Object.keys($unset).length) updateOp.$unset = $unset;

		const updated = await Certificate.findByIdAndUpdate(id, updateOp, { new: true })
			.populate("programId", "title")
			.populate("sessionId", "title year")
			.lean();

		if (!updated) {
			return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
		}

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating certificate:", error);
		return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
	}
}
