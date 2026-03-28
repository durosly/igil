"use client";

import { format } from "date-fns";
import { Award, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type PublicCertificateRow = {
	certificateNumber?: string;
	programTitle: string;
	sessionLabel: string;
	issuedAt?: string;
	completedAt: string;
	hasDocument: boolean;
};

type CertificateVerificationRow = {
	fullName: string;
	certificates: PublicCertificateRow[];
};

export default function CertificateLookupClient({ initialQuery }: { initialQuery: string }) {
	const [query, setQuery] = useState(initialQuery.trim());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<CertificateVerificationRow[] | null>(null);
	const [searched, setSearched] = useState(false);

	const runSearch = useCallback(async (q: string) => {
		const trimmed = q.trim();
		if (!trimmed) {
			setError("Enter your certificate number or your full name as registered.");
			setResults(null);
			setSearched(true);
			return;
		}
		setLoading(true);
		setError(null);
		setSearched(true);
		try {
			const res = await fetch(
				`/api/public/certificate-lookup?q=${encodeURIComponent(trimmed)}`
			);
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(typeof data.error === "string" ? data.error : "Something went wrong.");
				setResults(null);
				return;
			}
			setResults((data.results ?? []) as CertificateVerificationRow[]);
		} catch {
			setError("Could not reach the server. Try again.");
			setResults(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (initialQuery.trim()) {
			void runSearch(initialQuery);
		}
	}, [initialQuery, runSearch]);

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<form
				className="flex flex-col sm:flex-row gap-3 mb-10"
				onSubmit={(e) => {
					e.preventDefault();
					void runSearch(query);
				}}
			>
				<label className="sr-only" htmlFor="certificate-lookup-q">
					Certificate number or full name
				</label>
				<input
					id="certificate-lookup-q"
					type="search"
					autoComplete="off"
					placeholder="Certificate number or full name"
					className="input input-bordered flex-1 w-full bg-white"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button type="submit" className="btn btn-primary gap-2" disabled={loading}>
					{loading ? (
						<span className="loading loading-spinner loading-sm" />
					) : (
						<Search className="w-4 h-4" />
					)}
					Look up
				</button>
			</form>

			{error && (
				<div className="alert alert-warning mb-6" role="alert">
					<span>{error}</span>
				</div>
			)}

			{searched && !loading && !error && results && results.length === 0 && (
				<div className="alert alert-info">
					<span>No matching certificate or student record was found. Check spelling and try again.</span>
				</div>
			)}

			{results && results.length > 0 && (
				<ul className="space-y-8">
					{results.map((row, idx) => (
						<li
							key={`${row.fullName}-${idx}`}
							className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm"
						>
							<div className="flex items-start gap-3 mb-4">
								<div className="bg-primary/15 p-2 rounded-lg shrink-0">
									<Award className="w-6 h-6 text-primary" />
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900">{row.fullName}</h2>
									<p className="text-sm text-base-content/70 mt-1">
										Registered program certificate(s) on file
									</p>
								</div>
							</div>

							{row.certificates.length === 0 ? (
								<p className="text-base-content/80 text-sm pl-11">
									No certificate records are on file for this name. If you recently completed a
									program, allow time for processing or contact the office.
								</p>
							) : (
								<ul className="space-y-4 pl-11">
									{row.certificates.map((c, cIdx) => (
										<li
											key={`${c.certificateNumber ?? c.programTitle}-${cIdx}`}
											className="bg-base-200/80 rounded-lg p-4 space-y-1"
										>
											<p className="font-medium text-gray-900">{c.programTitle}</p>
											<p className="text-sm text-base-content/80">
												{c.sessionLabel} — completed{" "}
												{c.completedAt
													? format(new Date(c.completedAt), "PP")
													: "—"}
											</p>
											{c.certificateNumber && (
												<p className="text-sm text-base-content/90">
													<span className="text-base-content/60">Certificate number: </span>
													<span className="font-mono font-medium">{c.certificateNumber}</span>
												</p>
											)}
											{c.issuedAt && (
												<p className="text-xs text-base-content/60">
													Issued {format(new Date(c.issuedAt), "PP")}
												</p>
											)}
											<p className="text-xs text-base-content/50 pt-1">
												{c.hasDocument
													? "Official document is on file. Signed-in students can download from their account when eligible."
													: "Certificate document not yet uploaded."}
											</p>
										</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
