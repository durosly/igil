export type EnrollmentDeletionImpactCertificate = {
	_id: string;
	hasUploadedFile: boolean;
	originalFileName?: string;
	sessionLabel?: string;
};

export type EnrollmentDeletionImpactPaymentCode = {
	_id: string;
	code: string;
	used: boolean;
};

export type EnrollmentDeletionImpact = {
	enrollmentId: string;
	studentName: string;
	studentEmail?: string;
	programTitle: string;
	sessionLabel?: string;
	source: string;
	certificate: EnrollmentDeletionImpactCertificate | null;
	paymentCodes: EnrollmentDeletionImpactPaymentCode[];
};
