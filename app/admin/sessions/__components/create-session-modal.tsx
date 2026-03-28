"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useAdminSessionsNewModal } from "./admin-sessions-search-params";
import type { ProgramRef, Session } from "./session-types";

const createSessionSchema = z.object({
	programId: z.string().min(1, "Program is required"),
	year: z
		.number({ message: "Year is required" })
		.refine((n) => Number.isFinite(n) && !Number.isNaN(n), { message: "Year is required" })
		.int()
		.min(1990)
		.max(2100),
	title: z.string().min(1, "Title is required").max(200),
});

type CreateSessionValues = z.infer<typeof createSessionSchema>;

interface CreateSessionModalProps {
	programs: ProgramRef[];
}

function defaultYear(): number {
	return new Date().getFullYear();
}

export default function CreateSessionModal({ programs }: CreateSessionModalProps) {
	const { open, closeModal } = useAdminSessionsNewModal();

	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateSessionValues>({
		resolver: zodResolver(createSessionSchema),
		defaultValues: {
			programId: "",
			year: defaultYear(),
			title: "",
		},
	});

	useEffect(() => {
		if (!open) return;
		reset({
			programId: programs[0]?._id ?? "",
			year: defaultYear(),
			title: "",
		});
	}, [open, programs, reset]);

	const createMutation = useMutation({
		mutationFn: async (body: CreateSessionValues) => {
			const { data } = await axios.post<Session>("/api/admin/sessions", body);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sessions"] });
			closeModal();
			toast.success("Session created");
		},
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e)
				? (e.response?.data as { error?: string } | undefined)?.error
				: undefined;
			toast.error(typeof msg === "string" ? msg : "Failed to create session");
		},
	});

	const onSubmit = (values: CreateSessionValues) => {
		createMutation.mutate({
			...values,
			title: values.title.trim(),
		});
	};

	const handleClose = () => {
		if (!createMutation.isPending) closeModal();
	};

	if (!open) return null;

	return (
		<dialog open className="modal modal-open">
			<div className="modal-box">
				<h3 className="font-bold text-lg">New Session</h3>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
					<div className="form-control">
						<label className="label">
							<span className="label-text">Program</span>
						</label>
						<select
							className="select select-bordered"
							disabled={programs.length === 0}
							{...register("programId")}
						>
							<option value="">Select program</option>
							{programs.map((p) => (
								<option key={p._id} value={p._id}>
									{p.title}
								</option>
							))}
						</select>
						{errors.programId && (
							<span className="label-text-alt text-error">{errors.programId.message}</span>
						)}
						{programs.length === 0 && (
							<span className="label-text-alt text-warning mt-1">
								No programs found. Add a program under Programs first.
							</span>
						)}
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Year</span>
						</label>
						<input
							type="number"
							className="input input-bordered"
							{...register("year", { valueAsNumber: true })}
						/>
						{errors.year && (
							<span className="label-text-alt text-error">{errors.year.message}</span>
						)}
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Title</span>
						</label>
						<input
							type="text"
							className="input input-bordered"
							placeholder="e.g. 2025 Spring Batch"
							{...register("title")}
						/>
						{errors.title && (
							<span className="label-text-alt text-error">{errors.title.message}</span>
						)}
					</div>
					<div className="modal-action">
						<button type="button" className="btn" onClick={handleClose}>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={createMutation.isPending || programs.length === 0}
						>
							{createMutation.isPending ? "Creating..." : "Create"}
						</button>
					</div>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button type="button" onClick={handleClose}>
					close
				</button>
			</form>
		</dialog>
	);
}
