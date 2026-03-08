import { Schema, model, models, Model } from "mongoose";

export interface ICertificate {
	_id?: string;
	userId: string;
	programId: Schema.Types.ObjectId;
	sessionId: Schema.Types.ObjectId;
	completedAt: Date;
	downloadCount: number;
	lastUnlockUntil?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

const CertificateSchema = new Schema<ICertificate>(
	{
		userId: {
			type: String,
			required: [true, "User ID is required"],
		},
		programId: {
			type: Schema.Types.ObjectId,
			ref: "Program",
			required: [true, "Program is required"],
		},
		sessionId: {
			type: Schema.Types.ObjectId,
			ref: "ProgramSession",
			required: [true, "Session is required"],
		},
		completedAt: {
			type: Date,
			required: [true, "Completed at is required"],
		},
		downloadCount: {
			type: Number,
			default: 0,
		},
		lastUnlockUntil: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

CertificateSchema.index({ userId: 1, programId: 1 }, { unique: true });
CertificateSchema.index({ userId: 1 });

const Certificate: Model<ICertificate> = models.Certificate || model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
