export default function AdminEnrollmentsLoading() {
	return (
		<div>
			<div className="skeleton mb-6 h-10 max-w-[12rem] rounded-md" aria-hidden />

			<div className="space-y-4">
				<div className="flex flex-wrap items-end gap-3">
					<div className="form-control min-w-[200px]">
						<div className="skeleton h-3 w-14 mb-1.5" aria-hidden />
						<div className="skeleton h-8 w-full max-w-xs rounded-field" aria-hidden />
					</div>
					<div className="form-control min-w-[220px]">
						<div className="skeleton h-3 w-12 mb-1.5" aria-hidden />
						<div className="skeleton h-8 w-full max-w-md rounded-field" aria-hidden />
					</div>
					<div className="form-control min-w-[140px]">
						<div className="skeleton h-3 w-12 mb-1.5" aria-hidden />
						<div className="skeleton h-8 w-full max-w-xs rounded-field" aria-hidden />
					</div>
					<div className="form-control flex-1 min-w-[200px] max-w-md">
						<div className="skeleton h-3 w-12 mb-1.5" aria-hidden />
						<div className="skeleton h-8 w-full rounded-field" aria-hidden />
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="table table-zebra">
						<thead>
							<tr>
								{Array.from({ length: 10 }, (_, i) => (
									<th key={i}>
										<div
											className={`skeleton h-4 ${i === 9 ? "w-8" : i === 5 ? "w-16" : "w-14"}`}
											aria-hidden
										/>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 6 }, (_, i) => (
								<tr key={i}>
									<td>
										<div className="skeleton h-4 w-24" />
									</td>
									<td>
										<div className="skeleton h-4 w-36 max-w-full" />
									</td>
									<td>
										<div className="skeleton h-4 w-28" />
									</td>
									<td>
										<div className="skeleton h-4 w-32" />
									</td>
									<td>
										<div className="skeleton h-4 w-12" />
									</td>
									<td>
										<div className="skeleton h-4 w-20" />
									</td>
									<td>
										<div className="skeleton h-5 w-8 rounded-full" />
									</td>
									<td>
										<div className="skeleton h-5 w-8 rounded-full" />
									</td>
									<td>
										<div className="skeleton h-5 w-8 rounded-full" />
									</td>
									<td>
										<div className="skeleton h-8 w-16 rounded-field" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 pt-2">
					<div className="skeleton h-4 w-52" aria-hidden />
					<div className="join">
						<div className="skeleton h-8 w-20 rounded-field join-item" aria-hidden />
						<div className="skeleton h-8 w-16 rounded-field join-item" aria-hidden />
					</div>
				</div>
			</div>
		</div>
	);
}
