import type { Metadata } from "next";
import connectDB from "@/lib/db";
import ProgramSession from "@/models/ProgramSession";
import Program from "@/models/Program";
import SessionsManager from "../__components/sessions-manager";

export const metadata: Metadata = {
	title: "Sessions",
	description: "Manage program sessions",
};

export default async function AdminSessionsPage() {
	await connectDB();
	const [sessions, programs] = await Promise.all([
		ProgramSession.find().populate("programId", "title").sort({ year: -1 }).lean(),
		Program.find().select("_id title").lean(),
	]);

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Sessions</h1>
			<SessionsManager
				initialSessions={JSON.parse(JSON.stringify(sessions))}
				programs={JSON.parse(JSON.stringify(programs))}
			/>
		</div>
	);
}
