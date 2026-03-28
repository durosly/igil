"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ADMIN_SESSIONS_NEW_MODAL_HREF } from "./admin-sessions-search-params";

export default function NewSessionButton() {
	return (
		<div className="flex justify-end mb-4">
			<Link href={ADMIN_SESSIONS_NEW_MODAL_HREF} scroll={false} className="btn btn-primary gap-2">
				<Plus className="w-5 h-5" />
				New Session
			</Link>
		</div>
	);
}
