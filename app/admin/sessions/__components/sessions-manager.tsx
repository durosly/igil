"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ProgramRef, Session } from "./session-types";
import SessionsTable from "./sessions-table";
import CreateSessionModal from "./create-session-modal";

interface SessionsManagerProps {
	initialSessions: Session[];
	programs: ProgramRef[];
}

async function fetchSessions(): Promise<Session[]> {
	const { data } = await axios.get<Session[]>("/api/admin/sessions");
	return data;
}

export default function SessionsManager({ initialSessions, programs }: SessionsManagerProps) {
	const { data: sessions = initialSessions } = useQuery({
		queryKey: ["sessions"],
		queryFn: fetchSessions,
		initialData: initialSessions,
	});

	return (
		<div>
			<SessionsTable sessions={sessions} />
			<CreateSessionModal programs={programs} />
		</div>
	);
}
