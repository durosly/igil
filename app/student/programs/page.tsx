import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Program from "@/models/Program";
import ProgramSession from "@/models/ProgramSession";
import ProgramsList from "./__components/programs-list";

export const metadata: Metadata = {
	title: "Programs",
	description: "Browse and register for programs",
};

export default async function StudentProgramsPage() {
	await connectDB();
	const [programs, sessions] = await Promise.all([
		Program.find({ status: "active" }).sort({ title: 1 }).lean(),
		ProgramSession.find().populate("programId", "title").sort({ year: -1 }).lean(),
	]);

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Programs</h1>
			<ProgramsList
				programs={JSON.parse(JSON.stringify(programs))}
				sessions={JSON.parse(JSON.stringify(sessions))}
			/>
		</div>
	);
}
