import type { ProgramStatus } from "@/models/Program";

/**
 * Program as plain JSON: safe for Next.js Server → Client props, fetch JSON, and client cache.
 * Contrasts with `IProgram` / Mongoose lean docs where `_id` may be ObjectId and dates are `Date`.
 */
export interface ProgramSerialized {
	_id: string;
	title: string;
	description: string;
	coverImageUrl?: string;
	paymentInstruction?: string;
	status: ProgramStatus;
	createdAt?: string;
	updatedAt?: string;
}
