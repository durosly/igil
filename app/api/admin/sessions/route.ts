import connectDB from "@/lib/db";
import ProgramSession from "@/models/ProgramSession";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
	try {
		await connectDB();
		const programId = request.nextUrl.searchParams.get("programId");
		const filter = programId ? { programId } : {};
		const sessions = await ProgramSession.find(filter)
			.populate("programId", "title")
			.sort({ year: -1, createdAt: -1 })
			.lean();
		return NextResponse.json(sessions);
	} catch (error) {
		console.error("Error fetching sessions:", error);
		return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
	}
}

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
		const { programId, year, title } = body;
		if (!programId || year == null || !title) {
			return NextResponse.json(
				{ error: "programId, year, and title are required" },
				{ status: 400 }
			);
		}

		const newSession = await ProgramSession.create({
			programId,
			year: Number(year),
			title: String(title).trim(),
			studentIds: [],
		});
		return NextResponse.json(newSession, { status: 201 });
	} catch (error) {
		console.error("Error creating session:", error);
		return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
	}
}
