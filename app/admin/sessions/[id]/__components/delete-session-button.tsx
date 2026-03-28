"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import type { SessionDeletionImpact } from "@/lib/admin/session-deletion-types";
import DeleteSessionModal from "./delete-session-modal";

interface DeleteSessionButtonProps {
	sessionId: string;
	impact: SessionDeletionImpact;
}

export default function DeleteSessionButton({ sessionId, impact }: DeleteSessionButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await axios.delete(`/api/admin/sessions/${sessionId}`);
			toast.success("Session deleted");
			setOpen(false);
			router.push("/admin/sessions");
			router.refresh();
		} catch (e: unknown) {
			const msg = axios.isAxiosError(e) ? e.response?.data?.error : undefined;
			toast.error(typeof msg === "string" ? msg : "Failed to delete session");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<button type="button" className="btn btn-outline btn-error btn-sm" onClick={() => setOpen(true)}>
				Delete session
			</button>
			<DeleteSessionModal
				open={open}
				onClose={() => !isDeleting && setOpen(false)}
				impact={impact}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
			/>
		</>
	);
}
