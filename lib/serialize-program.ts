import { toUtcIsoString } from "@/lib/date-utils";
import type { ProgramSerialized } from "@/types/program-serialized";
import type { ProgramStatus } from "@/models/Program";
import type { Types } from "mongoose";

/** Minimal shape of a Program document from `.lean()` before crossing the server/client boundary. */
export type LeanProgramDoc = {
	_id: Types.ObjectId | string;
	title: string;
	description: string;
	coverImageUrl?: string;
	paymentInstruction?: string;
	status: ProgramStatus;
	createdAt?: Date | string;
	updatedAt?: Date | string;
	__v?: number;
};

export function serializeProgram(doc: LeanProgramDoc): ProgramSerialized {
	return {
		_id: String(doc._id),
		title: doc.title,
		description: doc.description,
		coverImageUrl: doc.coverImageUrl,
		paymentInstruction: doc.paymentInstruction,
		status: doc.status,
		createdAt: toUtcIsoString(doc.createdAt),
		updatedAt: toUtcIsoString(doc.updatedAt),
	};
}

export function serializePrograms(docs: LeanProgramDoc[]): ProgramSerialized[] {
	return docs.map(serializeProgram);
}
