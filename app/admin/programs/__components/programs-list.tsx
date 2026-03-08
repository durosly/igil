"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Program {
	_id: string;
	title: string;
	description: string;
	coverImageUrl?: string;
	paymentInstruction?: string;
	status: string;
	createdAt?: string;
}

interface ProgramsListProps {
	initialPrograms: Program[];
}

async function fetchPrograms(): Promise<Program[]> {
	const res = await fetch("/api/programs");
	if (!res.ok) throw new Error("Failed to fetch programs");
	return res.json();
}

export default function ProgramsList({ initialPrograms }: ProgramsListProps) {
	const { data: programs = initialPrograms, refetch } = useQuery({
		queryKey: ["programs"],
		queryFn: fetchPrograms,
		initialData: initialPrograms,
	});

	const handleDelete = async (id: string, title: string) => {
		if (!confirm(`Delete program "${title}"?`)) return;
		try {
			const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
			if (!res.ok) {
				const d = await res.json();
				throw new Error(d.error ?? "Delete failed");
			}
			toast.success("Program deleted");
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to delete");
		}
	};

	if (programs.length === 0) {
		return (
			<div className="alert alert-info">
				<span>No programs yet. Create your first program to get started.</span>
			</div>
		);
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
							<div className="flex items-center justify-center text-base-content/40">No cover</div>
						)}
						<span className="absolute top-2 right-2 badge badge-primary badge-sm">{program.status}</span>
					</figure>
					<div className="card-body">
						<h2 className="card-title line-clamp-1">{program.title}</h2>
						<p className="line-clamp-2 text-sm text-base-content/80">{program.description}</p>
						{program.createdAt && (
							<p className="text-xs text-base-content/60">
								{format(new Date(program.createdAt), "MMM d, yyyy")}
							</p>
						)}
						<div className="card-actions justify-end mt-4 flex gap-2">
							<Link
								href={`/admin/programs/${program._id}/edit`}
								className="btn btn-sm btn-ghost gap-1"
							>
								<Pencil className="w-4 h-4" />
								Edit
							</Link>
							<button
								type="button"
								onClick={() => handleDelete(program._id, program.title)}
								className="btn btn-sm btn-ghost text-error gap-1"
							>
								<Trash2 className="w-4 h-4" />
								Delete
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
