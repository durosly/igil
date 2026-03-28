"use client";

import type { SessionDeletionImpact } from "@/lib/admin/session-deletion-types";

interface DeleteSessionModalProps {
	open: boolean;
	onClose: () => void;
	impact: SessionDeletionImpact;
	onConfirm: () => void;
	isDeleting: boolean;
}

export default function DeleteSessionModal({
	open,
	onClose,
	impact,
	onConfirm,
	isDeleting,
}: DeleteSessionModalProps) {
	if (!open) return null;

	return (
		<dialog open className="modal modal-open">
			<div className="modal-box max-w-lg max-h-[90vh] overflow-y-auto">
				<h3 className="font-bold text-lg text-error">Delete session</h3>
				<p className="text-sm text-base-content/80 mt-2">
					This cannot be undone. The following data will be affected:
				</p>

				<ul className="mt-4 space-y-4 text-sm">
					<li>
						<span className="font-semibold">Session</span>
						<ul className="list-disc list-inside mt-1 text-base-content/90">
							<li>
								{impact.programTitle} — {impact.sessionTitle} ({impact.year})
							</li>
							<li className="text-base-content/70">The program session record will be removed.</li>
						</ul>
					</li>

					<li>
						<span className="font-semibold">Certificates ({impact.certificates.length})</span>
						<p className="mt-1 text-base-content/70">
							These certificate records will be deleted. Any uploaded files will be removed from
							storage.
						</p>
						{impact.certificates.length === 0 ? (
							<p className="mt-1 text-base-content/70">None</p>
						) : (
							<ul className="mt-1 space-y-1 list-disc list-inside">
								{impact.certificates.map((c) => (
									<li key={c._id}>
										{c.userName}{" "}
										<span className="text-base-content/60">
											({c.programTitle}
											{c.hasUploadedFile && (
												<>
													{" "}
													— uploaded file
													{c.originalFileName ? ` (${c.originalFileName})` : ""}
												</>
											)}
											)
										</span>
									</li>
								))}
							</ul>
						)}
					</li>

					<li>
						<span className="font-semibold">Enrollments ({impact.enrollments.length})</span>
						<p className="mt-1 text-base-content/70">
							Enrollment rows stay in the database; only the link to this session will be cleared.
							Students remain enrolled in the program.
						</p>
						{impact.enrollments.length === 0 ? (
							<p className="mt-1 text-base-content/70">None currently assigned to this session.</p>
						) : (
							<ul className="mt-1 space-y-1 list-disc list-inside">
								{impact.enrollments.map((e) => (
									<li key={e._id}>
										{e.userName}{" "}
										<span className="text-base-content/60 font-mono text-xs">{e.userId}</span>
									</li>
								))}
							</ul>
						)}
					</li>
				</ul>

				<div className="modal-action flex-wrap gap-2">
					<button type="button" className="btn" onClick={onClose} disabled={isDeleting}>
						Cancel
					</button>
					<button type="button" className="btn btn-error" onClick={onConfirm} disabled={isDeleting}>
						{isDeleting ? "Deleting…" : "Delete session"}
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button type="button" onClick={onClose} disabled={isDeleting}>
					close
				</button>
			</form>
		</dialog>
	);
}
