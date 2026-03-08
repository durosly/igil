import { Schema, model, models, Model } from "mongoose";

export type ProgramStatus = "draft" | "active" | "completed";

export interface IProgram {
	_id?: string;
	title: string;
	description: string;
	coverImageUrl?: string;
	paymentInstruction?: string;
	status: ProgramStatus;
	createdAt?: Date;
	updatedAt?: Date;
}

const ProgramSchema = new Schema<IProgram>(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			maxlength: [200, "Title cannot exceed 200 characters"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true,
		},
		coverImageUrl: {
			type: String,
			trim: true,
		},
		paymentInstruction: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: ["draft", "active", "completed"],
			default: "draft",
		},
	},
	{
		timestamps: true,
	}
);

ProgramSchema.index({ status: 1, createdAt: -1 });

const Program: Model<IProgram> = models.Program || model<IProgram>("Program", ProgramSchema);

export default Program;
