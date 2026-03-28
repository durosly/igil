function FormPanelSkeleton() {
	return (
		<div className="card bg-base-200 shadow-xl">
			<div className="card-body space-y-4">
				<div className="skeleton h-8 w-48 max-w-full" aria-hidden />
				{Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="form-control w-full">
						<div className="skeleton h-4 w-32 mb-2" aria-hidden />
						<div className="skeleton h-10 w-full rounded-field" aria-hidden />
					</div>
				))}
				<div className="card-actions justify-end mt-4">
					<div className="skeleton h-10 w-32 rounded-field" aria-hidden />
				</div>
			</div>
		</div>
	);
}

export default function AdminSettingsLoading() {
	return (
		<div>
			<div className="skeleton mb-8 h-10 max-w-[10rem] rounded-md" aria-hidden />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<FormPanelSkeleton />
				<FormPanelSkeleton />
			</div>
		</div>
	);
}
