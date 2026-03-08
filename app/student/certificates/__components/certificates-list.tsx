"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { isAfter } from "date-fns";

interface Cert {
	_id: string;
	programId: { _id: string; title: string } | string;
	sessionId: { title: string; year: number } | string;
	completedAt: string;
	downloadCount: number;
	lastUnlockUntil?: string;
}

interface CertificatesListProps {
	certificates: Cert[];
}

async function fetchCertificates(): Promise<Cert[]> {
	const res = await fetch("/api/student/certificates");
	if (!res.ok) throw new Error("Failed to fetch");
	const d = await res.json();
	return (d.certificates ?? d) as Cert[];
}

function programTitle(p: { title: string } | string) {
	return typeof p === "object" && p !== null ? p.title : "—";
}

export default function CertificatesList({ certificates: initial }: CertificatesListProps) {
	const { data: certificates = initial } = useQuery({
		queryKey: ["student-certificates"],
		queryFn: fetchCertificates,
		initialData: initial,
	});

	const canDownload = (c: Cert) => {
		if (c.downloadCount === 0) return true;
		if (c.lastUnlockUntil && isAfter(new Date(c.lastUnlockUntil), new Date())) return true;
		return false;
	};

	return (
		<div className="space-y-4">
			{certificates.length === 0 ? (
				<div className="alert alert-info">
					<span>You have no certificates yet. Complete a program to receive a certificate.</span>
				</div>
			) : (
				<ul className="space-y-3">
					{certificates.map((c) => (
						<li key={c._id} className="flex flex-wrap items-center justify-between gap-2 p-4 bg-base-200 rounded-lg">
							<div>
								<p className="font-medium">{programTitle(c.programId)}</p>
								<p className="text-sm text-base-content/70">
									{typeof c.sessionId === "object" ? `${c.sessionId.title} (${c.sessionId.year})` : ""} – completed{" "}
									{format(new Date(c.completedAt), "PP")}
								</p>
								<p className="text-xs text-base-content/60">Downloads: {c.downloadCount}</p>
							</div>
							{canDownload(c) ? (
								<a
									href={`/api/student/certificates/${c._id}/download`}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-primary btn-sm"
								>
									Download
								</a>
							) : (
								<span className="text-sm text-base-content/60">
									Re-download requires payment. Contact admin to unlock.
								</span>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
