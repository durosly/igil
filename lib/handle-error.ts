import { isAxiosError } from "axios";
import { z } from "zod";
import { APIError } from "better-auth/api";

export function handleError(error: unknown): string {
	let message = "Something went wrong";

	if (error instanceof z.ZodError) {
		// message = error.errors[0].message;
		message = error.issues[0].message;
	} else if (error instanceof APIError) {
		if (error.status === "UNAUTHORIZED") {
			message = "Invalid credentials provided";
		} else {
			message = error.message || "A better-auth API error occurred";
		}
	} else if (error instanceof Error) {
		// Handle Axios errors
		if (isAxiosError(error)) {
			message = error.response?.data?.message || error.response?.statusText || "An Axios error occurred";
		} else {
			// Handle standard JS errors
			message = error.message || "An unknown error occurred";
		}
	} else if (typeof error === "string") {
		// Handle string-based errors
		message = error;
	} else if (typeof error === "object" && error !== null) {
		// Handle object-based errors with a "message" property
		message = (error as { message?: string }).message || "An unknown error occurred";
	}

	return message;
}
