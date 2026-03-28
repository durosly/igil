export default function AdminDashboardLoading() {
	return (
		<div>
			<div className="skeleton mb-6 h-10 max-w-[18rem] rounded-md" aria-hidden />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="stat bg-base-200 rounded-lg shadow">
						<div className="skeleton h-4 w-28 mb-2" aria-hidden />
						<div className="skeleton h-10 w-20 mb-2" aria-hidden />
						<div className="skeleton h-3 w-40" aria-hidden />
					</div>
				))}
			</div>
		</div>
	);
}
