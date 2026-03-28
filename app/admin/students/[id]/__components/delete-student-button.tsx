"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import type { StudentDeletionImpact } from "@/lib/admin/student-deletion-types";
import DeleteStudentModal from "./delete-student-modal";

type EnrollmentRow = {
	_id: string;
	programTitle: string;
	sessionLabel?: string;
	source: string;
};

interface DeleteStudentButtonProps {
	studentId: string;
	studentName?: string;
	studentEmail?: string;
	enrollments: EnrollmentRow[];
	deletionImpact: StudentDeletionImpact;
}

export default function DeleteStudentButton({
	studentId,
	studentName,
	studentEmail,
	enrollments,
	deletionImpact,
}: DeleteStudentButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await axios.delete(`/api/admin/students/${studentId}`);
			toast.success("Student deleted");
			setOpen(false);
			router.push("/admin/students");
			router.refresh();
		} catch (e: unknown) {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Failed to delete student");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<button type="button" className="btn btn-outline btn-error btn-sm" onClick={() => setOpen(true)}>
				Delete student
			</button>
			<DeleteStudentModal
				open={open}
				onClose={() => !isDeleting && setOpen(false)}
				studentName={studentName}
				studentEmail={studentEmail}
				enrollments={enrollments}
				deletionImpact={deletionImpact}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
			/>
		</>
	);
}
