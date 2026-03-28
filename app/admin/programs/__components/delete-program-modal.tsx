"use client";

import type { ProgramDeletionImpact } from "@/lib/admin/program-deletion-types";

interface DeleteProgramModalProps {
	open: boolean;
	onClose: () => void;
	programTitle: string;
	impact: ProgramDeletionImpact | null;
	previewLoading: boolean;
	previewError: string | null;
	onConfirm: () => void;
	isDeleting: boolean;
}

export default function DeleteProgramModal({
	open,
	onClose,
	programTitle,
	impact,
	previewLoading,
	previewError,
	onConfirm,
	isDeleting,
}: DeleteProgramModalProps) {
	if (!open) return null;

	return (
		<dialog open className="modal modal-open">
			<div className="modal-box max-w-lg max-h-[90vh] overflow-y-auto">
				<h3 className="font-bold text-lg text-error">Delete program permanently</h3>
				<p className="text-sm text-base-content/80 mt-2">
					This cannot be undone. The following data tied to{" "}
					<span className="font-medium">{programTitle}</span> will be removed:
				</p>

				{previewLoading && (
					<div className="mt-6 flex justify-center py-8">
						<span className="loading loading-spinner loading-md" />
					</div>
				)}

				{previewError && !previewLoading && (
					<div className="alert alert-error mt-4 text-sm">{previewError}</div>
				)}

				{impact && !previewLoading && !previewError && (
					<ul className="mt-4 space-y-4 text-sm">
						<li>
							<span className="font-semibold">Program</span>
							<p className="mt-1 text-base-content/90">{impact.title}</p>
						</li>

						<li>
							<span className="font-semibold">Sessions ({impact.sessionCount})</span>
							{impact.sessionCount === 0 ? (
								<p className="mt-1 text-base-content/70">None</p>
							) : (
								<>
									{impact.sessionCount > impact.sessions.length && (
										<p className="mt-1 text-xs text-base-content/60">
											Showing first {impact.sessions.length} of {impact.sessionCount}
										</p>
									)}
									<ul className="mt-1 space-y-1 list-disc list-inside">
										{impact.sessions.map((s, i) => (
											<li key={`${s.title}-${s.year}-${i}`}>
												{s.title} ({s.year})
											</li>
										))}
									</ul>
								</>
							)}
						</li>

						<li>
							<span className="font-semibold">Enrollments ({impact.enrollmentCount})</span>
							<p className="mt-1 text-base-content/70">
								All enrollment rows for this program will be deleted.
							</p>
						</li>

						<li>
							<span className="font-semibold">Certificates ({impact.certificateCount})</span>
							{impact.certificateCount === 0 ? (
								<p className="mt-1 text-base-content/70">None</p>
							) : (
								<p className="mt-1 text-base-content/70">
									{impact.certificatesWithUploadedFile > 0 && (
										<>
											{impact.certificatesWithUploadedFile} with uploaded files — files will be
											removed from storage.{" "}
										</>
									)}
									All certificate records for this program will be deleted.
								</p>
							)}
						</li>

						<li>
							<span className="font-semibold">Payment codes ({impact.paymentCodeCount})</span>
							<p className="mt-1 text-base-content/70">
								{impact.paymentCodeCount === 0
									? "None"
									: "All payment codes for this program will be deleted."}
							</p>
						</li>

						<li>
							<span className="font-semibold">Cover image</span>
							<p className="mt-1 text-base-content/70">
								{!impact.hasCoverImageUrl
									? "No cover image stored."
									: impact.willRemoveCoverFromStorage
										? "The cover image will be removed from storage."
										: "A cover URL is set but it is not on this app’s storage — only the program link will be removed."}
							</p>
						</li>
					</ul>
				)}

				<div className="modal-action flex-wrap gap-2">
					<button
						type="button"
						className="btn"
						onClick={onClose}
						disabled={isDeleting}
					>
						Cancel
					</button>
					<button
						type="button"
						className="btn btn-error"
						onClick={onConfirm}
						disabled={
							isDeleting || previewLoading || !!previewError || !impact
						}
					>
						{isDeleting ? "Deleting…" : "Delete program"}
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
