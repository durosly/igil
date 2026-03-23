import type { Metadata } from "next";
import connectDB from "@/lib/db";
import { serializePrograms } from "@/lib/serialize-program";
import Program from "@/models/Program";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProgramsList from "./__components/programs-list";

export const metadata: Metadata = {
	title: "Programs",
	description: "Manage programs",
};

export default async function AdminProgramsPage() {
	await connectDB();
	const raw = await Program.find().sort({ createdAt: -1 }).lean();
	const programs = serializePrograms(raw);

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-4xl font-bold">Programs</h1>
				<Link href="/admin/programs/new" className="btn btn-primary gap-2">
					<Plus className="w-5 h-5" />
					New Program
				</Link>
			</div>
			<ProgramsList initialPrograms={programs} />
		</div>
	);
}
