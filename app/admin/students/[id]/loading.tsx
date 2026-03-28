export default function AdminStudentProfileLoading() {
	return (
		<div>
			<div className="mb-6">
				<div className="skeleton h-4 w-24" aria-hidden />
			</div>
			<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
				<div className="skeleton h-10 max-w-[14rem] w-full rounded-md" aria-hidden />
				<div className="skeleton h-10 w-36 rounded-field" aria-hidden />
			</div>

			<div className="max-w-2xl space-y-8">
				<section className="space-y-4">
					<div className="skeleton h-7 w-24" aria-hidden />
					<dl className="grid gap-2 text-sm">
						<div>
							<div className="skeleton h-3 w-10 mb-1" aria-hidden />
							<div className="skeleton h-5 w-48" aria-hidden />
						</div>
						<div>
							<div className="skeleton h-3 w-10 mb-1" aria-hidden />
							<div className="skeleton h-5 w-56" aria-hidden />
						</div>
					</dl>
					<div className="flex items-center gap-3">
						<div className="skeleton h-6 w-6 rounded" aria-hidden />
						<div className="skeleton h-4 w-28" aria-hidden />
					</div>
					<div className="skeleton h-12 w-full max-w-2xl" aria-hidden />
				</section>

				<section>
					<div className="skeleton h-7 w-32 mb-3" aria-hidden />
					<ul className="space-y-2">
						{Array.from({ length: 3 }, (_, i) => (
							<li key={i} className="p-3 bg-base-200 rounded-lg">
								<div className="skeleton h-4 w-full max-w-xs mb-2" aria-hidden />
								<div className="skeleton h-3 w-40" aria-hidden />
							</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
