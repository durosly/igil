export interface ProgramRef {
	_id: string;
	title: string;
}

export interface Session {
	_id: string;
	programId: ProgramRef | string;
	year: number;
	title: string;
	studentCount?: number;
}

export function getProgramTitle(s: Session): string {
	return typeof s.programId === "object" && s.programId !== null
		? (s.programId as ProgramRef).title
		: "Program";
}
