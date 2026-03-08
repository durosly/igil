import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Program from "@/models/Program";
import { notFound } from "next/navigation";
import ProgramForm from "../../__components/program-form";

export const metadata: Metadata = {
	title: "Edit Program",
	description: "Edit program",
};

export default async function EditProgramPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await connectDB();
	const { id } = await params;
	const program = await Program.findById(id).lean();
	if (!program) notFound();

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Edit Program</h1>
			<ProgramForm
				program={{
					_id: String(program._id),
					title: program.title,
					description: program.description,
					coverImageUrl: program.coverImageUrl,
					paymentInstruction: program.paymentInstruction,
					status: program.status,
				}}
			/>
		</div>
	);
}
