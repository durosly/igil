import { isValid, parseISO } from "date-fns";

function asDate(value: Date | string): Date {
	return typeof value === "string" ? parseISO(value) : value;
}

/** UTC ISO-8601 string for APIs and Server → Client props. */
export function toUtcIsoString(value: Date | string | null | undefined): string | undefined {
	if (value == null) return undefined;
	const date = asDate(value);
	if (!isValid(date)) return undefined;
	return date.toISOString();
}
