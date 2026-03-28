export type SessionDeletionImpactCertificate = {
	_id: string;
	userId: string;
	userName: string;
	programTitle: string;
	hasUploadedFile: boolean;
	originalFileName?: string;
};

export type SessionDeletionImpactEnrollment = {
	_id: string;
	userId: string;
	userName: string;
};

export type SessionDeletionImpact = {
	sessionId: string;
	programTitle: string;
	sessionTitle: string;
	year: number;
	certificates: SessionDeletionImpactCertificate[];
	enrollments: SessionDeletionImpactEnrollment[];
};
