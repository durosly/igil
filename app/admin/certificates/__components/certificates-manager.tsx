"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { isAfter } from "date-fns";
import { toast } from "sonner";

interface CertItem {
	_id: string;
	userId: string;
	programId: { _id: string; title: string } | string;
	sessionId: { _id: string; title: string; year: number } | string;
	completedAt: string;
	downloadCount: number;
	lastUnlockUntil?: string;
}

interface CertificatesManagerProps {
	initialCertificates: CertItem[];
}

async function fetchCertificates(): Promise<{ certificates: CertItem[] }> {
	const res = await fetch("/api/admin/certificates");
	if (!res.ok) throw new Error("Failed to fetch");
	return res.json();
}

export default function CertificatesManager({ initialCertificates }: CertificatesManagerProps) {
	const queryClient = useQueryClient();
	const { data = { certificates: initialCertificates } } = useQuery({
		queryKey: ["admin-certificates"],
		queryFn: fetchCertificates,
		initialData: { certificates: initialCertificates },
	});

	const certificates = data.certificates ?? [];

	const unlockMutation = useMutation({
		mutationFn: async (body: { userId: string; programId: string; sessionId: string; unlockHours: number }) => {
			const res = await fetch("/api/admin/certificates/unlock", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				const d = await res.json();
				throw new Error(d.error ?? "Failed");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
			toast.success("Download unlocked for 24 hours");
		},
		onError: (e: Error) => toast.error(e.message),
	});

	const programTitle = (p: { _id: string; title: string } | string) =>
		typeof p === "object" && p !== null ? p.title : "—";
	const sessionTitle = (s: { title: string; year: number } | string) =>
		typeof s === "object" && s !== null ? `${s.title} (${s.year})` : "—";

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th>User ID</th>
						<th>Program</th>
						<th>Session</th>
						<th>Downloads</th>
						<th>Unlocked until</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{certificates.map((c) => (
						<tr key={c._id}>
							<td className="font-mono text-sm">{c.userId}</td>
							<td>{programTitle(c.programId)}</td>
							<td>{sessionTitle(c.sessionId)}</td>
							<td>{c.downloadCount}</td>
							<td>
								{c.lastUnlockUntil
									? isAfter(new Date(c.lastUnlockUntil), new Date())
										? format(new Date(c.lastUnlockUntil), "PPp")
										: "Expired"
									: "—"}
							</td>
							<td>
								<button
									type="button"
									className="btn btn-sm btn-primary"
									onClick={() =>
										unlockMutation.mutate({
											userId: c.userId,
											programId: typeof c.programId === "object" ? (c.programId as { _id: string })._id : c.programId,
											sessionId: typeof c.sessionId === "object" ? (c.sessionId as { _id: string })._id : c.sessionId,
											unlockHours: 24,
										})
									}
									disabled={unlockMutation.isPending}
								>
									Unlock 24h
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{certificates.length === 0 && (
				<div className="alert alert-info mt-4">
					<span>No certificates yet. Mark enrollments as completed to create certificates.</span>
				</div>
			)}
		</div>
	);
}
