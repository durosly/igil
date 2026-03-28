"use client";

import type { EnrollmentDeletionImpact } from "@/lib/admin/enrollment-deletion-types";

interface DeleteEnrollmentModalProps {
	open: boolean;
	onClose: () => void;
	impact: EnrollmentDeletionImpact;
	onConfirm: () => void;
	isDeleting: boolean;
}

export default function DeleteEnrollmentModal({
	open,
	onClose,
	impact,
	onConfirm,
	isDeleting,
}: DeleteEnrollmentModalProps) {
	if (!open) return null;

	return (
		<dialog open className="modal modal-open">
			<div className="modal-box max-w-lg max-h-[90vh] overflow-y-auto">
				<h3 className="font-bold text-lg text-error">Delete enrollment permanently</h3>
				<p className="text-sm text-base-content/80 mt-2">
					This cannot be undone. The following will be removed:
				</p>

				<ul className="mt-4 space-y-4 text-sm">
					<li>
						<span className="font-semibold">Enrollment</span>
						<ul className="list-disc list-inside mt-1 text-base-content/90">
							<li>{impact.studentName}</li>
							{impact.studentEmail && <li>{impact.studentEmail}</li>}
							<li>{impact.programTitle}</li>
							{impact.sessionLabel && (
								<li>
									Session: <span className="text-base-content/80">{impact.sessionLabel}</span>
								</li>
							)}
							<li>
								Source: <span className="text-base-content/80">{impact.source}</span>
							</li>
						</ul>
					</li>

					<li>
						<span className="font-semibold">
							Certificate {impact.certificate ? "(1)" : "(0)"}
						</span>
						{!impact.certificate ? (
							<p className="mt-1 text-base-content/70">None</p>
						) : (
							<ul className="mt-1 space-y-1 list-disc list-inside">
								<li>
									Program certificate for this enrollment
									{impact.certificate.sessionLabel && (
										<span className="text-base-content/70">
											{" "}
											· {impact.certificate.sessionLabel}
										</span>
									)}
									{impact.certificate.hasUploadedFile && (
										<span className="text-base-content/70">
											{" "}
											— uploaded file
											{impact.certificate.originalFileName
												? ` (${impact.certificate.originalFileName})`
												: ""}{" "}
											will be removed from storage
										</span>
									)}
								</li>
							</ul>
						)}
					</li>

					<li>
						<span className="font-semibold">Payment codes ({impact.paymentCodes.length})</span>
						<p className="mt-1 text-base-content/70">
							Codes tied to this student and program will be deleted.
						</p>
						{impact.paymentCodes.length === 0 ? (
							<p className="mt-1 text-base-content/70">None</p>
						) : (
							<ul className="mt-1 space-y-1 list-disc list-inside">
								{impact.paymentCodes.map((p) => (
									<li key={p._id}>
										<code className="text-xs bg-base-200 px-1 rounded">{p.code}</code> ·{" "}
										{p.used ? "used" : "unused"}
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
						{isDeleting ? "Deleting…" : "Delete enrollment"}
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
