export default function AdminGalleryLoading() {
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<div className="skeleton h-10 max-w-[20rem] w-full rounded-md" aria-hidden />
				<div className="skeleton h-10 w-28 rounded-field" aria-hidden />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }, (_, i) => (
					<div key={i} className="card bg-base-200 shadow-xl overflow-hidden">
						<div className="relative aspect-square w-full bg-base-300">
							<div className="skeleton h-full w-full rounded-none" aria-hidden />
						</div>
						<div className="card-body">
							<div className="skeleton h-6 w-4/5 mb-2" aria-hidden />
							<div className="skeleton h-4 w-full mb-1" aria-hidden />
							<div className="skeleton h-4 w-3/4 mb-4" aria-hidden />
							<div className="card-actions justify-end mt-4 flex gap-2">
								<div className="skeleton h-8 w-14 rounded-field" aria-hidden />
								<div className="skeleton h-8 w-16 rounded-field" aria-hidden />
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="flex flex-col items-center gap-4 mt-8 py-6">
				<div className="skeleton h-4 w-64" aria-hidden />
				<div className="flex gap-2 items-center">
					<div className="skeleton h-8 w-24 rounded-field" aria-hidden />
					<div className="skeleton h-8 w-8 rounded-field" aria-hidden />
					<div className="skeleton h-8 w-8 rounded-field" aria-hidden />
					<div className="skeleton h-8 w-8 rounded-field" aria-hidden />
					<div className="skeleton h-8 w-20 rounded-field" aria-hidden />
				</div>
			</div>
		</div>
	);
}
