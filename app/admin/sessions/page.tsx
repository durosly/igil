import type { Metadata } from "next";
import connectDB from "@/lib/db";
import ProgramSession from "@/models/ProgramSession";
import Program from "@/models/Program";
import NewSessionButton from "./__components/new-session-button";
import SessionsManager from "./__components/sessions-manager";

export const metadata: Metadata = {
	title: "Sessions",
	description: "Manage program sessions",
};

/** Always read fresh DB data (avoids stale empty `programs` from build-time or cached RSC). */
export const dynamic = "force-dynamic";

export default async function AdminSessionsPage() {
	await connectDB();
	const [sessions, programs] = await Promise.all([
		ProgramSession.find().populate("programId", "title").sort({ year: -1 }).lean(),
		Program.find().select("_id title").sort({ title: 1 }).lean(),
	]);

	const initialSessions = JSON.parse(JSON.stringify(sessions));
	const initialPrograms = JSON.parse(JSON.stringify(programs));

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Sessions</h1>
			<div className="flex flex-col">
				<NewSessionButton />
				<SessionsManager initialSessions={initialSessions} programs={initialPrograms} />
			</div>
		</div>
	);
}
