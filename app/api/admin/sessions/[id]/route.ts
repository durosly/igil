import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ProgramSession from "@/models/ProgramSession";
import Enrollment from "@/models/Enrollment";
import type { IEnrollment } from "@/models/Enrollment";
import { auth } from "@/lib/auth";
import { Types } from "mongoose";

function normalizeMembershipUserIds(studentIds: unknown[]): string[] {
	const out: string[] = [];
	const seen = new Set<string>();
	for (const x of studentIds) {
		if (typeof x === "string" && x.length > 0 && !seen.has(x)) {
			seen.add(x);
			out.push(x);
		}
	}
	return out;
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
		if ((session.user as { role?: string }).role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		await connectDB();
		const { id } = await params;
		const body = await request.json();
		const { title, year, studentIds } = body;

		const existing = await ProgramSession.findById(id).lean();
		if (!existing) {
			return NextResponse.json({ error: "Session not found" }, { status: 404 });
		}

		const programOid = existing.programId as unknown as Types.ObjectId;
		const sessionOid = new Types.ObjectId(id);

		const update: Record<string, unknown> = {};
		if (title !== undefined) update.title = title;
		if (year !== undefined) update.year = year;

		if (studentIds !== undefined) {
			if (!Array.isArray(studentIds)) {
				return NextResponse.json(
					{ error: "studentIds must be an array" },
					{ status: 400 }
				);
			}
			const normalized = normalizeMembershipUserIds(studentIds);

			await Enrollment.updateMany(
				{
					programId: programOid as unknown as IEnrollment["programId"],
					sessionId: sessionOid as unknown as NonNullable<IEnrollment["sessionId"]>,
					userId: { $nin: normalized },
				} as never,
				{ $unset: { sessionId: "" } }
			);

			for (const userId of normalized) {
				const res = await Enrollment.updateOne(
					{
						programId: programOid as unknown as IEnrollment["programId"],
						userId,
					} as never,
					{ $set: { sessionId: sessionOid } } as never
				);
				if (res.matchedCount === 0) {
					return NextResponse.json(
						{
							error: `No enrollment found for this program for user ${userId}.`,
						},
						{ status: 400 }
					);
				}
			}
		}

		const updated = await ProgramSession.findByIdAndUpdate(id, update, { new: true })
			.populate("programId", "title")
			.lean();
		if (!updated) {
			return NextResponse.json({ error: "Session not found" }, { status: 404 });
		}

		const membershipUserIds = (await Enrollment.distinct("userId", {
			programId: programOid as unknown as IEnrollment["programId"],
			sessionId: sessionOid as unknown as NonNullable<IEnrollment["sessionId"]>,
		} as never)) as string[];

		return NextResponse.json({
			...updated,
			membershipUserIds,
		});
	} catch (error) {
		console.error("Error updating session:", error);
		return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
	}
}

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();
		const { id } = await params;
		const session = await ProgramSession.findById(id).populate("programId", "title").lean();
		if (!session) {
			return NextResponse.json({ error: "Session not found" }, { status: 404 });
		}

		const programOid = session.programId as unknown as Types.ObjectId;
		const sessionOid = new Types.ObjectId(id);

		const membershipUserIds = await Enrollment.distinct("userId", {
			programId: programOid as unknown as IEnrollment["programId"],
			sessionId: sessionOid as unknown as NonNullable<IEnrollment["sessionId"]>,
		} as never);

		return NextResponse.json({
			...session,
			membershipUserIds,
		});
	} catch (error) {
		console.error("Error fetching session:", error);
		return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
	}
}
