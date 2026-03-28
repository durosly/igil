"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import type { ProgramSerialized } from "@/types/program-serialized";
import type { ProgramDeletionImpact } from "@/lib/admin/program-deletion-types";
import DeleteProgramModal from "./delete-program-modal";

interface ProgramsListProps {
	initialPrograms: ProgramSerialized[];
}

async function fetchPrograms(): Promise<ProgramSerialized[]> {
	const res = await fetch("/api/programs");
	if (!res.ok) throw new Error("Failed to fetch programs");
	return res.json();
}

export default function ProgramsList({ initialPrograms }: ProgramsListProps) {
	const queryClient = useQueryClient();
	const { data: programs = initialPrograms, refetch } = useQuery({
		queryKey: ["programs"],
		queryFn: fetchPrograms,
		initialData: initialPrograms,
	});

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
	const [deleteTargetTitle, setDeleteTargetTitle] = useState("");
	const [deleteImpact, setDeleteImpact] = useState<ProgramDeletionImpact | null>(null);
	const [previewLoading, setPreviewLoading] = useState(false);
	const [previewError, setPreviewError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const closeDeleteModal = useCallback(() => {
		if (isDeleting) return;
		setDeleteModalOpen(false);
		setDeleteTargetId(null);
		setDeleteTargetTitle("");
		setDeleteImpact(null);
		setPreviewLoading(false);
		setPreviewError(null);
	}, [isDeleting]);

	const openDeleteModal = useCallback(async (id: string, title: string) => {
		setDeleteTargetId(id);
		setDeleteTargetTitle(title);
		setDeleteImpact(null);
		setPreviewError(null);
		setPreviewLoading(true);
		setDeleteModalOpen(true);
		try {
			const { data } = await axios.get<ProgramDeletionImpact>(
				`/api/programs/${id}/delete-preview`
			);
			setDeleteImpact(data);
		} catch (e: unknown) {
			const msg = axios.isAxiosError(e)
				? (e.response?.data as { error?: string })?.error
				: undefined;
			setPreviewError(typeof msg === "string" ? msg : "Failed to load delete preview");
		} finally {
			setPreviewLoading(false);
		}
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!deleteTargetId) return;
		setIsDeleting(true);
		try {
			await axios.delete(`/api/programs/${deleteTargetId}`);
			toast.success("Program deleted");
			closeDeleteModal();
			refetch();
			queryClient.invalidateQueries({ queryKey: ["programs"] });
		} catch (e: unknown) {
			const msg = axios.isAxiosError(e)
				? (e.response?.data as { error?: string })?.error
				: undefined;
			toast.error(typeof msg === "string" ? msg : "Failed to delete program");
		} finally {
			setIsDeleting(false);
		}
	}, [deleteTargetId, closeDeleteModal, refetch, queryClient]);

	if (programs.length === 0) {
		return (
			<div className="alert alert-info">
				<span>No programs yet. Create your first program to get started.</span>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{programs.map((program) => (
					<div key={program._id} className="card bg-base-200 shadow-xl overflow-hidden">
						<figure className="relative aspect-video w-full bg-base-300 overflow-hidden">
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
							<span className="absolute top-2 right-2 badge badge-primary badge-sm">
								{program.status}
							</span>
						</figure>
						<div className="card-body">
							<h2 className="card-title line-clamp-1">{program.title}</h2>
							<p className="line-clamp-2 text-sm text-base-content/80">
								{program.description}
							</p>
							{program.createdAt && (
								<p className="text-xs text-base-content/60">
									{format(new Date(program.createdAt), "MMM d, yyyy")}
								</p>
							)}
							<div className="card-actions justify-end mt-4 flex gap-2">
								<Link
									href={`/admin/programs/${program._id}/edit`}
									className="btn btn-sm btn-ghost gap-1">
									<Pencil className="w-4 h-4" />
									Edit
								</Link>
								<button
									type="button"
									onClick={() => openDeleteModal(program._id, program.title)}
									className="btn btn-sm btn-ghost text-error gap-1">
									<Trash2 className="w-4 h-4" />
									Delete
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<DeleteProgramModal
				open={deleteModalOpen}
				onClose={closeDeleteModal}
				programTitle={deleteTargetTitle}
				impact={deleteImpact}
				previewLoading={previewLoading}
				previewError={previewError}
				onConfirm={confirmDelete}
				isDeleting={isDeleting}
			/>
		</>
	);
}
