export default function AdminCertificatesLoading() {
	return (
		<div>
			<div className="skeleton mb-6 h-10 max-w-[14rem] rounded-md" aria-hidden />

			<div className="overflow-x-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							{["User ID", "Program", "Session", "Cert", "Doc", "DL", "Unlock", "Action"].map(
								(label, i) => (
									<th key={label}>
										<div
											className={`skeleton h-4 ${i === 0 ? "w-14" : i === 7 ? "w-16" : "w-12"}`}
											aria-hidden
										/>
									</th>
								)
							)}
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: 6 }, (_, i) => (
							<tr key={i}>
								<td>
									<div className="skeleton h-4 w-32 max-w-full" />
								</td>
								<td>
									<div className="skeleton h-4 w-28" />
								</td>
								<td>
									<div className="skeleton h-4 w-36" />
								</td>
								<td>
									<div className="skeleton h-4 w-16" />
								</td>
								<td>
									<div className="skeleton h-4 w-10" />
								</td>
								<td>
									<div className="skeleton h-4 w-6" />
								</td>
								<td>
									<div className="skeleton h-4 w-24" />
								</td>
								<td>
									<div className="skeleton h-8 w-28 rounded-field" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
