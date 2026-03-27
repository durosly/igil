"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateStudentModal } from "./create-student-modal";
import { StudentsFilters } from "./students-filters";
import { StudentsPagination } from "./students-pagination";
import { StudentsTable } from "./students-table";
import type { Program, StudentsListPayload } from "./students-types";
import { useAdminStudentsList } from "./use-admin-students-list";

export type { StudentsListPayload };

interface StudentsManagerProps {
	initialPayload: StudentsListPayload;
	programs: Program[];
}

export default function StudentsManager({
	initialPayload,
	programs,
}: StudentsManagerProps) {
	const [showModal, setShowModal] = useState(false);
	const list = useAdminStudentsList(initialPayload);

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<button
					type="button"
					onClick={() => setShowModal(true)}
					className="btn btn-primary gap-2"
				>
					<Plus className="w-5 h-5" />
					Create Student
				</button>
			</div>

			<StudentsFilters
				qInput={list.qInput}
				onQInputChange={list.setQInput}
				programId={list.programId}
				onProgramIdChange={list.setProgramId}
				profileFilter={list.profileFilter}
				onProfileFilterChange={list.setProfileFilter}
				programs={programs}
			/>

			<StudentsTable
				students={list.students}
				hasActiveFilters={list.hasActiveFilters}
			/>

			<StudentsPagination
				total={list.total}
				page={list.page}
				totalPages={list.totalPages}
				onPageChange={list.setPage}
			/>

			<CreateStudentModal
				open={showModal}
				onClose={() => setShowModal(false)}
				programs={programs}
			/>
		</div>
	);
}
