"use client";

import type { Program } from "./students-types";

interface StudentsFiltersProps {
	qInput: string;
	onQInputChange: (value: string) => void;
	programId: string;
	onProgramIdChange: (value: string) => void;
	profileFilter: "" | "yes" | "no";
	onProfileFilterChange: (value: "" | "yes" | "no") => void;
	programs: Program[];
}

export function StudentsFilters({
	qInput,
	onQInputChange,
	programId,
	onProgramIdChange,
	profileFilter,
	onProfileFilterChange,
	programs,
}: StudentsFiltersProps) {
	return (
		<div className="flex flex-wrap items-end gap-3">
			<div className="form-control flex-1 min-w-[200px] max-w-md">
				<label className="label py-1">
					<span className="label-text text-xs">Search</span>
				</label>
				<input
					type="search"
					className="input input-bordered input-sm w-full"
					placeholder="Name or email"
					value={qInput}
					onChange={(e) => onQInputChange(e.target.value)}
				/>
			</div>
			<div className="form-control min-w-[200px]">
				<label className="label py-1">
					<span className="label-text text-xs">Enrolled in program</span>
				</label>
				<select
					className="select select-bordered select-sm w-full max-w-xs"
					value={programId}
					onChange={(e) => onProgramIdChange(e.target.value)}
				>
					<option value="">Any program</option>
					{programs.map((p) => (
						<option key={p._id} value={p._id}>
							{p.title}
						</option>
					))}
				</select>
			</div>
			<div className="form-control min-w-[180px]">
				<label className="label py-1">
					<span className="label-text text-xs">Profile approved</span>
				</label>
				<select
					className="select select-bordered select-sm w-full max-w-xs"
					value={profileFilter}
					onChange={(e) =>
						onProfileFilterChange(e.target.value as "" | "yes" | "no")
					}
				>
					<option value="">All</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</select>
			</div>
		</div>
	);
}
