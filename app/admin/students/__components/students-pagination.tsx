"use client";

interface StudentsPaginationProps {
	total: number;
	page: number;
	totalPages: number;
	onPageChange: (next: number) => void;
}

export function StudentsPagination({
	total,
	page,
	totalPages,
	onPageChange,
}: StudentsPaginationProps) {
	if (total <= 0) return null;

	return (
		<div className="flex flex-wrap items-center justify-between gap-2 pt-2">
			<p className="text-sm text-base-content/70">
				{total} student{total === 1 ? "" : "s"} · Page {page} of {totalPages}
			</p>
			<div className="join">
				<button
					type="button"
					className="join-item btn btn-sm"
					disabled={page <= 1}
					onClick={() => onPageChange(Math.max(1, page - 1))}
				>
					Previous
				</button>
				<button
					type="button"
					className="join-item btn btn-sm"
					disabled={page >= totalPages}
					onClick={() => onPageChange(page + 1)}
				>
					Next
				</button>
			</div>
		</div>
	);
}
