import { Schema, model, models, Model } from "mongoose";

export interface IProgramSession {
	_id?: string;
	programId: Schema.Types.ObjectId;
	year: number;
	title: string;
	studentIds: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

const ProgramSessionSchema = new Schema<IProgramSession>(
	{
		programId: {
			type: Schema.Types.ObjectId,
			ref: "Program",
			required: [true, "Program is required"],
		},
		year: {
			type: Number,
			required: [true, "Year is required"],
		},
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			maxlength: [200, "Title cannot exceed 200 characters"],
		},
		studentIds: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
		collection: "program_sessions",
	}
);

ProgramSessionSchema.index({ programId: 1, year: -1 });

const ProgramSession: Model<IProgramSession> =
	models.ProgramSession || model<IProgramSession>("ProgramSession", ProgramSessionSchema);

export default ProgramSession;
