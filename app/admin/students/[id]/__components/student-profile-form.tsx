"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type StudentProfileInitial = {
	id: string;
	name?: string;
	email?: string;
	profileApproved?: boolean;
	enrollments: {
		_id: string;
		programTitle: string;
		sessionLabel?: string;
		source: string;
		programApproved: boolean;
		paymentApproved: boolean;
	}[];
};

export default function StudentProfileForm({ initial }: { initial: StudentProfileInitial }) {
	const queryClient = useQueryClient();
	const [profileApproved, setProfileApproved] = useState(!!initial.profileApproved);

	const { data: student = initial } = useQuery({
		queryKey: ["admin-student", initial.id],
		queryFn: async () => {
			const { data } = await axios.get<StudentProfileInitial>(`/api/admin/students/${initial.id}`);
			return data;
		},
		initialData: initial,
	});

	useEffect(() => {
		setProfileApproved(!!student.profileApproved);
	}, [student.profileApproved]);

	const patchMutation = useMutation({
		mutationFn: async (next: boolean) => {
			await axios.patch(`/api/admin/students/${initial.id}`, { profileApproved: next });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-students"] });
			queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
			queryClient.invalidateQueries({ queryKey: ["admin-student", initial.id] });
			toast.success("Profile approval updated");
		},
		onError: (e: unknown) => {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Update failed");
		},
	});

	const onToggleProfile = (checked: boolean) => {
		const prev = profileApproved;
		setProfileApproved(checked);
		patchMutation.mutate(checked, {
			onError: () => setProfileApproved(prev),
		});
	};

	return (
		<div className="max-w-2xl space-y-8">
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Student</h2>
				<dl className="grid gap-2 text-sm">
					<div>
						<dt className="text-base-content/60">Name</dt>
						<dd className="font-medium">{initial.name ?? "—"}</dd>
					</div>
					<div>
						<dt className="text-base-content/60">Email</dt>
						<dd className="font-medium">{initial.email ?? "—"}</dd>
					</div>
				</dl>
				<label className="label cursor-pointer justify-start gap-3 w-fit">
					<input
						type="checkbox"
						className="checkbox checkbox-primary"
						checked={profileApproved}
						disabled={patchMutation.isPending}
						onChange={(ev) => onToggleProfile(ev.target.checked)}
					/>
					<span className="label-text">Profile approved</span>
				</label>
				<p className="text-sm text-base-content/70">
					Approving the profile updates this student&apos;s user record and sets profile approval on all
					of their enrollments.
				</p>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-3">Enrollments</h2>
				{student.enrollments.length === 0 ? (
					<p className="text-sm text-base-content/70">No enrollments.</p>
				) : (
					<ul className="space-y-2">
						{student.enrollments.map((e) => (
							<li
								key={e._id}
								className="flex flex-wrap items-center gap-2 justify-between p-3 bg-base-200 rounded-lg"
							>
								<div>
									<Link href={`/admin/enrollments/${e._id}`} className="link link-primary font-medium">
										{e.programTitle}
									</Link>
									{e.sessionLabel && (
										<span className="text-sm text-base-content/70 ml-2">{e.sessionLabel}</span>
									)}
									<span className="badge badge-sm ml-2">{e.source}</span>
								</div>
								<div className="text-xs text-base-content/60">
									Program OK: {e.programApproved ? "Yes" : "No"} · Payment OK:{" "}
									{e.paymentApproved ? "Yes" : "No"}
								</div>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
