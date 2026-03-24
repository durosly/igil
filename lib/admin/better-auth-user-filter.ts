import { ObjectId } from "mongodb";

/**
 * Better Auth's MongoDB adapter maps logical `id` to document `_id` (ObjectId).
 * Raw queries must use `_id` for typical 24-char hex user ids from the app.
 */
export function betterAuthUserIdFilter(
	userId: string
): { _id: ObjectId } | { id: string } {
	if (/^[a-f0-9]{24}$/i.test(userId)) {
		try {
			return { _id: new ObjectId(userId) };
		} catch {
			/* fall through */
		}
	}
	return { id: userId };
}

export function betterAuthUserDocumentId(doc: {
	id?: string;
	_id?: unknown;
}): string {
	if (typeof doc.id === "string" && doc.id.length > 0) return doc.id;
	if (doc._id != null) {
		if (typeof doc._id === "string") return doc._id;
		if (doc._id instanceof ObjectId) return doc._id.toHexString();
	}
	return "";
}
