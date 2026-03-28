export default function AdminSessionsLoading() {
	return (
		<div>
			<div className="skeleton mb-6 h-10 max-w-[12rem] rounded-md" aria-hidden />

			<div className="flex flex-col">
				{/* NewSessionButton: flex justify-end mb-4 + btn-shaped block */}
				<div className="mb-4 flex justify-end">
					<div className="skeleton h-10 w-[10.5rem] rounded-field" aria-hidden />
				</div>

				{/* SessionsManager → SessionsTable */}
				<div className="overflow-x-auto">
					<table className="table table-zebra">
						<thead>
							<tr>
								<th>
									<div
										className="skeleton h-4 w-20"
										aria-hidden
									/>
								</th>
								<th>
									<div
										className="skeleton h-4 w-10"
										aria-hidden
									/>
								</th>
								<th>
									<div
										className="skeleton h-4 w-14"
										aria-hidden
									/>
								</th>
								<th>
									<div
										className="skeleton h-4 w-20"
										aria-hidden
									/>
								</th>
								<th className="w-28" aria-hidden>
									<div
										className="skeleton h-4 w-16"
										aria-hidden
									/>
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
										<div className="skeleton h-4 w-12" />
									</td>
									<td>
										<div className="skeleton h-4 w-full max-w-[14rem]" />
									</td>
									<td>
										<div className="skeleton h-4 w-8" />
									</td>
									<td>
										<div className="skeleton h-8 w-20 rounded-field" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
