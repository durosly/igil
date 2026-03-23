"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { handleError } from "@/lib/handle-error";
import ProgramCoverUpload from "./program-cover-upload";

const STATUS_OPTIONS = ["draft", "active"] as const;

const programFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	coverImageUrl: z.string(),
	paymentInstruction: z.string(),
	status: z.enum(STATUS_OPTIONS),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

interface ProgramFormProps {
	program?: {
		_id: string;
		title: string;
		description: string;
		coverImageUrl?: string;
		paymentInstruction?: string;
		status: string;
	};
}

export default function ProgramForm({ program }: ProgramFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [coverUploading, setCoverUploading] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ProgramFormValues>({
		resolver: zodResolver(programFormSchema),
		defaultValues: {
			title: program?.title ?? "",
			description: program?.description ?? "",
			coverImageUrl: program?.coverImageUrl ?? "",
			paymentInstruction: program?.paymentInstruction ?? "",
			status: (program?.status as ProgramFormValues["status"]) ?? "draft",
		},
	});

	const saveMutation = useMutation({
		mutationFn: async (data: ProgramFormValues) => {
			const payload = {
				title: data.title.trim(),
				description: data.description.trim(),
				paymentInstruction: data.paymentInstruction.trim() || undefined,
				status: data.status,
				coverImageUrl: data.coverImageUrl.trim() || undefined,
			};
			if (program) {
				await axios.patch(`/api/programs/${program._id}`, payload);
			} else {
				await axios.post("/api/programs", payload);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["programs"] });
			toast.success(program ? "Program updated" : "Program created");
			router.push("/admin/programs");
		},
		onError: (err) => toast.error(handleError(err)),
	});

	const saving = saveMutation.isPending;
	const blockEdits = saving || coverUploading;

	const onSubmit = (data: ProgramFormValues) => saveMutation.mutate(data);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="">
			<div className="gap-6">
				<fieldset className="fieldset w-full">
					<legend className="fieldset-legend">Title</legend>
					<input
						id="program-title"
						type="text"
						className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
						{...register("title")}
						disabled={blockEdits}
						aria-invalid={errors.title ? true : undefined}
						aria-describedby={errors.title ? "program-title-error" : undefined}
					/>
					{errors.title ? (
						<p id="program-title-error" className="label text-error" role="alert">
							{errors.title.message}
						</p>
					) : null}
				</fieldset>

				<fieldset className="fieldset w-full">
					<legend className="fieldset-legend">Description</legend>
					<textarea
						id="program-description"
						className={`textarea textarea-bordered w-full ${errors.description ? "textarea-error" : ""}`}
						{...register("description")}
						rows={4}
						disabled={blockEdits}
						aria-invalid={errors.description ? true : undefined}
						aria-describedby={
							errors.description ? "program-description-error" : undefined
						}
					/>
					{errors.description ? (
						<p
							id="program-description-error"
							className="label text-error"
							role="alert">
							{errors.description.message}
						</p>
					) : null}
				</fieldset>

				<fieldset className="fieldset w-full">
					<legend className="fieldset-legend">Cover image</legend>
					<Controller
						name="coverImageUrl"
						control={control}
						render={({ field }) => (
							<ProgramCoverUpload
								value={field.value}
								onChange={field.onChange}
								disabled={saving}
								onUploadingChange={setCoverUploading}
							/>
						)}
					/>
				</fieldset>

				<fieldset className="fieldset w-full">
					<legend className="fieldset-legend">Payment instruction</legend>
					<p className="label">Optional</p>
					<textarea
						id="program-payment-instruction"
						className="textarea textarea-bordered w-full"
						{...register("paymentInstruction")}
						rows={3}
						placeholder="Instructions for payment..."
						disabled={blockEdits}
					/>
				</fieldset>

				<fieldset className="fieldset w-full">
					<legend className="fieldset-legend">Status</legend>
					<select
						id="program-status"
						className="select select-bordered w-full"
						{...register("status")}
						disabled={blockEdits}>
						{STATUS_OPTIONS.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</fieldset>

				<div className="card-actions justify-end gap-2 pt-2">
					<button
						type="button"
						className="btn btn-ghost"
						onClick={() => router.back()}
						disabled={blockEdits}>
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={blockEdits}>
						{saveMutation.isPending ? "Saving..." : program ? "Update" : "Create"}
					</button>
				</div>
			</div>
		</form>
	);
}
