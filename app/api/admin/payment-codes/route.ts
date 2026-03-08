import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PaymentCode from "@/models/PaymentCode";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if ((session.user as { role?: string }).role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const body = await request.json();
		const { userId, programId, type, amount, partIndex } = body;

		if (!userId || !programId || !type) {
			return NextResponse.json(
				{ error: "userId, programId, and type are required" },
				{ status: 400 }
			);
		}

		const code = `IGIL-${uuidv4().slice(0, 8).toUpperCase()}`;
		const paymentCode = await PaymentCode.create({
			code,
			userId,
			programId,
			amount: amount ?? undefined,
			type: type === "part" ? "part" : "full",
			partIndex: type === "part" ? partIndex : undefined,
			used: false,
		});

		return NextResponse.json(paymentCode, { status: 201 });
	} catch (error) {
		console.error("Error creating payment code:", error);
		return NextResponse.json({ error: "Failed to create payment code" }, { status: 500 });
	}
}
