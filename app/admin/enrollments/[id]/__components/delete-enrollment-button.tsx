"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import type { EnrollmentDeletionImpact } from "@/lib/admin/enrollment-deletion-types";
import DeleteEnrollmentModal from "./delete-enrollment-modal";

interface DeleteEnrollmentButtonProps {
	enrollmentId: string;
	impact: EnrollmentDeletionImpact;
}

export default function DeleteEnrollmentButton({
	enrollmentId,
	impact,
}: DeleteEnrollmentButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await axios.delete(`/api/admin/enrollments/${enrollmentId}`);
			toast.success("Enrollment deleted");
			setOpen(false);
			router.push("/admin/enrollments");
			router.refresh();
		} catch (e: unknown) {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Failed to delete enrollment");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<button type="button" className="btn btn-outline btn-error btn-sm" onClick={() => setOpen(true)}>
				Delete enrollment
			</button>
			<DeleteEnrollmentModal
				open={open}
				onClose={() => !isDeleting && setOpen(false)}
				impact={impact}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
			/>
		</>
	);
}
