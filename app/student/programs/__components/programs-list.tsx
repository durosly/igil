"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";

interface Program {
	_id: string;
	title: string;
	description: string;
	coverImageUrl?: string;
	status: string;
}

interface Session {
	_id: string;
	programId: { _id: string; title: string } | string;
	year: number;
	title: string;
}

interface ProgramsListProps {
	programs: Program[];
	sessions: Session[];
}

async function fetchPrograms(): Promise<Program[]> {
	const res = await fetch("/api/student/programs");
	if (!res.ok) throw new Error("Failed to fetch");
	return res.json();
}

export default function ProgramsList({ programs: initialPrograms, sessions }: ProgramsListProps) {
	const queryClient = useQueryClient();
	const { data: programs = initialPrograms } = useQuery({
		queryKey: ["student-programs"],
		queryFn: fetchPrograms,
		initialData: initialPrograms,
	});

	const enrollMutation = useMutation({
		mutationFn: async (programId: string) => {
			const res = await fetch("/api/enrollments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ programId }),
			});
			if (!res.ok) {
				const d = await res.json();
				throw new Error(d.error ?? "Enrollment failed");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
			toast.success("Enrollment request submitted. Wait for admin approval.");
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const sessionsByProgram = new Map<string, Session[]>();
	for (const s of sessions) {
		const pid =
			typeof s.programId === "object" && s.programId !== null
				? (s.programId as { _id: string })._id
				: String(s.programId);
		const list = sessionsByProgram.get(pid) ?? [];
		list.push(s);
		sessionsByProgram.set(pid, list);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{programs.map((program) => (
				<div key={program._id} className="card bg-base-200 shadow-xl overflow-hidden">
					<figure className="relative aspect-video w-full bg-base-300">
						{program.coverImageUrl ? (
							<Image
								src={program.coverImageUrl}
								alt={program.title}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 33vw"
							/>
						) : (
							<div className="flex items-center justify-center text-base-content/40">
								No cover
							</div>
						)}
					</figure>
					<div className="card-body">
						<h2 className="card-title">{program.title}</h2>
						<p className="line-clamp-3 text-sm">{program.description}</p>
						<div className="card-actions justify-end mt-4">
							<button
								type="button"
								className="btn btn-primary btn-sm"
								onClick={() => enrollMutation.mutate(program._id)}
								disabled={enrollMutation.isPending}>
								{enrollMutation.isPending
									? "Registering..."
									: "Register"}
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
