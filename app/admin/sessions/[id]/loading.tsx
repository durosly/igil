export default function AdminSessionDetailLoading() {
	return (
		<div>
			<div className="skeleton mb-2 h-10 max-w-[28rem] rounded-md" aria-hidden />
			<div className="skeleton mb-6 h-5 w-32" aria-hidden />

			<div>
				<div className="skeleton h-10 w-44 rounded-field mb-4" aria-hidden />
				<div className="skeleton h-4 w-full max-w-xl mb-4" aria-hidden />

				<div className="flex flex-wrap items-end gap-3 mb-4">
					<div className="form-control flex-1 min-w-[200px] max-w-md">
						<div className="skeleton h-3 w-12 mb-1.5" aria-hidden />
						<div className="skeleton h-8 w-full rounded-field" aria-hidden />
					</div>
					<div className="form-control min-w-[180px]">
						<div className="skeleton h-3 w-12 mb-1.5" aria-hidden />
						<div className="skeleton h-8 w-full max-w-xs rounded-field" aria-hidden />
					</div>
					<div className="form-control min-w-[180px]">
						<div className="skeleton h-3 w-12 mb-1.5" aria-hidden />
						<div className="skeleton h-8 w-full max-w-xs rounded-field" aria-hidden />
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="table table-zebra">
						<thead>
							<tr>
								<th>
									<div className="skeleton h-4 w-16" aria-hidden />
								</th>
								<th>
									<div className="skeleton h-4 w-10" aria-hidden />
								</th>
								<th>
									<div className="skeleton h-4 w-14" aria-hidden />
								</th>
								<th>
									<div className="skeleton h-4 w-16" aria-hidden />
								</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 8 }, (_, i) => (
								<tr key={i}>
									<td>
										<div className="skeleton h-5 w-5 rounded" />
									</td>
									<td>
										<div className="skeleton h-4 w-32" />
									</td>
									<td>
										<div className="skeleton h-4 w-40 max-w-full" />
									</td>
									<td>
										<div className="skeleton h-4 w-8" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 pt-2">
					<div className="skeleton h-4 w-56" aria-hidden />
					<div className="join">
						<div className="skeleton h-8 w-20 rounded-field join-item" aria-hidden />
						<div className="skeleton h-8 w-16 rounded-field join-item" aria-hidden />
					</div>
				</div>

				<div className="mt-4 flex gap-2">
					<div className="skeleton h-10 w-32 rounded-field" aria-hidden />
					<div className="skeleton h-10 w-20 rounded-field" aria-hidden />
				</div>
			</div>
		</div>
	);
}
