import { Schema, model, models, Model } from "mongoose";

export type PaymentCodeType = "full" | "part";

export interface IPaymentCode {
	_id?: string;
	code: string;
	userId: string;
	programId: Schema.Types.ObjectId;
	amount?: number;
	type: PaymentCodeType;
	partIndex?: number;
	used: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const PaymentCodeSchema = new Schema<IPaymentCode>(
	{
		code: {
			type: String,
			required: [true, "Code is required"],
			unique: true,
			trim: true,
		},
		userId: {
			type: String,
			required: [true, "User ID is required"],
		},
		programId: {
			type: Schema.Types.ObjectId,
			ref: "Program",
			required: [true, "Program is required"],
		},
		amount: {
			type: Number,
		},
		type: {
			type: String,
			enum: ["full", "part"],
			required: true,
		},
		partIndex: {
			type: Number,
		},
		used: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

PaymentCodeSchema.index({ userId: 1, programId: 1 });
PaymentCodeSchema.index({ code: 1 });

const PaymentCode: Model<IPaymentCode> = models.PaymentCode || model<IPaymentCode>("PaymentCode", PaymentCodeSchema);

export default PaymentCode;
