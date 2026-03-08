import type { Metadata } from "next";
import ProgramForm from "../__components/program-form";

export const metadata: Metadata = {
	title: "New Program",
	description: "Create a new program",
};

export default function NewProgramPage() {
	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">New Program</h1>
			<ProgramForm />
		</div>
	);
}
