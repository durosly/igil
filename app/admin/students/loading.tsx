export default function AdminStudentsLoading() {
	return (
		<div>
			<div className="skeleton mb-6 h-10 max-w-[10rem] rounded-md" aria-hidden />

			<div className="space-y-4">
				<div className="flex justify-end">
					<div className="skeleton h-10 w-[10.5rem] rounded-field" aria-hidden />
				</div>

				<div className="flex flex-wrap items-end gap-3">
					<div className="form-control flex-1 min-w-[200px] max-w-md">
						<div className="skeleton h-3 w-12 mb-1.5" aria-hidden />
						<div className="skeleton h-8 w-full rounded-field" aria-hidden />
					</div>
					<div className="form-control min-w-[200px]">
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
									<div className="skeleton h-4 w-12" aria-hidden />
								</th>
								<th>
									<div className="skeleton h-4 w-10" aria-hidden />
								</th>
								<th>
									<div className="skeleton h-4 w-28" aria-hidden />
								</th>
								<th>
									<div className="skeleton h-4 w-24" aria-hidden />
								</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 6 }, (_, i) => (
								<tr key={i}>
									<td>
										<div className="skeleton h-4 w-full max-w-[10rem]" />
									</td>
									<td>
										<div className="skeleton h-4 w-full max-w-[14rem]" />
									</td>
									<td>
										<div className="skeleton h-4 w-8" />
									</td>
									<td>
										<div className="skeleton h-4 w-6" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 pt-2">
					<div className="skeleton h-4 w-48" aria-hidden />
					<div className="join">
						<div className="skeleton h-8 w-20 rounded-field join-item" aria-hidden />
						<div className="skeleton h-8 w-16 rounded-field join-item" aria-hidden />
					</div>
				</div>
			</div>
		</div>
	);
}
