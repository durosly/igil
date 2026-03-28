export type StudentDeletionImpactCertificate = {
	_id: string;
	programTitle: string;
	sessionLabel?: string;
	originalFileName?: string;
	hasUploadedFile: boolean;
};

export type StudentDeletionImpactPaymentCode = {
	_id: string;
	code: string;
	programTitle: string;
	used: boolean;
};

export type StudentDeletionImpact = {
	certificates: StudentDeletionImpactCertificate[];
	paymentCodes: StudentDeletionImpactPaymentCode[];
};
