export default function AdminEnrollmentDetailLoading() {
	return (
		<div>
			<div className="mb-6">
				<div className="skeleton h-4 w-28" aria-hidden />
			</div>
			<div className="skeleton mb-6 h-10 max-w-[12rem] rounded-md" aria-hidden />

			<div className="max-w-2xl space-y-8">
				<div className="alert py-4">
					<div className="skeleton h-4 w-full max-w-md" aria-hidden />
				</div>

				<section className="space-y-3">
					<div className="skeleton h-7 w-20" aria-hidden />
					<div className="skeleton h-5 w-48" aria-hidden />
					<div className="skeleton h-4 w-64" aria-hidden />
				</section>

				<section className="space-y-2">
					<div className="skeleton h-7 w-28" aria-hidden />
					<dl className="grid gap-2">
						{Array.from({ length: 4 }, (_, i) => (
							<div key={i}>
								<div className="skeleton h-3 w-20 mb-1" aria-hidden />
								<div className="skeleton h-5 w-56" aria-hidden />
							</div>
						))}
					</dl>
				</section>

				<section className="space-y-4">
					<div className="skeleton h-7 w-28" aria-hidden />
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<div className="skeleton h-6 w-6 rounded" aria-hidden />
							<div className="skeleton h-4 w-36" aria-hidden />
						</div>
						<div className="flex items-center gap-3">
							<div className="skeleton h-6 w-6 rounded" aria-hidden />
							<div className="skeleton h-4 w-32" aria-hidden />
						</div>
					</div>
				</section>

				<section className="space-y-3">
					<div className="skeleton h-7 w-36" aria-hidden />
					<div className="skeleton h-10 w-full max-w-md rounded-field" aria-hidden />
					<div className="flex flex-wrap gap-3">
						<div className="skeleton h-10 w-28 rounded-field" aria-hidden />
						<div className="skeleton h-10 w-20 rounded-field" aria-hidden />
					</div>
				</section>

				<section className="space-y-3">
					<div className="skeleton h-7 w-32" aria-hidden />
					<div className="skeleton h-24 w-full rounded-lg" aria-hidden />
					<div className="flex flex-wrap gap-2">
						<div className="skeleton h-10 w-28 rounded-field" aria-hidden />
						<div className="skeleton h-10 w-24 rounded-field" aria-hidden />
					</div>
				</section>
			</div>
		</div>
	);
}
