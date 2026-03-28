"use client";

import type { StudentDeletionImpact } from "@/lib/admin/student-deletion-types";

type EnrollmentRow = {
	_id: string;
	programTitle: string;
	sessionLabel?: string;
	source: string;
};

interface DeleteStudentModalProps {
	open: boolean;
	onClose: () => void;
	studentName?: string;
	studentEmail?: string;
	enrollments: EnrollmentRow[];
	deletionImpact: StudentDeletionImpact;
	onConfirm: () => void;
	isDeleting: boolean;
}

export default function DeleteStudentModal({
	open,
	onClose,
	studentName,
	studentEmail,
	enrollments,
	deletionImpact,
	onConfirm,
	isDeleting,
}: DeleteStudentModalProps) {
	if (!open) return null;

	return (
		<dialog open className="modal modal-open">
			<div className="modal-box max-w-lg max-h-[90vh] overflow-y-auto">
				<h3 className="font-bold text-lg text-error">Delete student permanently</h3>
				<p className="text-sm text-base-content/80 mt-2">
					This cannot be undone. The following will be removed:
				</p>

				<ul className="mt-4 space-y-4 text-sm">
					<li>
						<span className="font-semibold">Account</span>
						<ul className="list-disc list-inside mt-1 text-base-content/90">
							<li>{studentName ?? "—"}</li>
							<li>{studentEmail ?? "—"}</li>
							<li>Login access and all active sessions (Better Auth)</li>
						</ul>
					</li>

					<li>
						<span className="font-semibold">Enrollments ({enrollments.length})</span>
						{enrollments.length === 0 ? (
							<p className="mt-1 text-base-content/70">None</p>
						) : (
							<ul className="mt-1 space-y-1 list-disc list-inside">
								{enrollments.map((e) => (
									<li key={e._id}>
										{e.programTitle}
										{e.sessionLabel ? ` · ${e.sessionLabel}` : ""}{" "}
										<span className="text-base-content/60">({e.source})</span>
									</li>
								))}
							</ul>
						)}
					</li>

					<li>
						<span className="font-semibold">Certificates ({deletionImpact.certificates.length})</span>
						{deletionImpact.certificates.length === 0 ? (
							<p className="mt-1 text-base-content/70">None</p>
						) : (
							<ul className="mt-1 space-y-1 list-disc list-inside">
								{deletionImpact.certificates.map((c) => (
									<li key={c._id}>
										{c.programTitle}
										{c.sessionLabel ? ` · ${c.sessionLabel}` : ""}
										{c.hasUploadedFile && (
											<span className="text-base-content/70">
												{" "}
												— uploaded file
												{c.originalFileName ? ` (${c.originalFileName})` : ""} will be removed
												from storage
											</span>
										)}
									</li>
								))}
							</ul>
						)}
					</li>

					<li>
						<span className="font-semibold">Payment codes ({deletionImpact.paymentCodes.length})</span>
						{deletionImpact.paymentCodes.length === 0 ? (
							<p className="mt-1 text-base-content/70">None</p>
						) : (
							<ul className="mt-1 space-y-1 list-disc list-inside">
								{deletionImpact.paymentCodes.map((p) => (
									<li key={p._id}>
										<code className="text-xs bg-base-200 px-1 rounded">{p.code}</code> ·{" "}
										{p.programTitle}
										{p.used ? " (used)" : " (unused)"}
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
						{isDeleting ? "Deleting…" : "Delete student"}
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
