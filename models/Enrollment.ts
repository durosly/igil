import { Schema, model, models, Model } from "mongoose";

export type EnrollmentSource = "invited" | "self";

export interface IEnrollment {
	_id?: string;
	userId: string;
	programId: Schema.Types.ObjectId;
	sessionId?: Schema.Types.ObjectId;
	source: EnrollmentSource;
	profileApproved: boolean;
	programApproved: boolean;
	paymentApproved: boolean;
	completedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
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
		},
		source: {
			type: String,
			enum: ["invited", "self"],
			required: true,
		},
		profileApproved: {
			type: Boolean,
			default: false,
		},
		programApproved: {
			type: Boolean,
			default: false,
		},
		paymentApproved: {
			type: Boolean,
			default: false,
		},
		completedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

EnrollmentSchema.index({ userId: 1, programId: 1 }, { unique: true });
EnrollmentSchema.index({ programId: 1 });
EnrollmentSchema.index({ userId: 1 });

const Enrollment: Model<IEnrollment> = models.Enrollment || model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;
