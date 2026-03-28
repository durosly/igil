export type ProgramDeletionSessionRow = {
	title: string;
	year: number;
};

export type ProgramDeletionImpact = {
	programId: string;
	title: string;
	sessionCount: number;
	sessions: ProgramDeletionSessionRow[];
	enrollmentCount: number;
	certificateCount: number;
	certificatesWithUploadedFile: number;
	paymentCodeCount: number;
	willRemoveCoverFromStorage: boolean;
	hasCoverImageUrl: boolean;
};
