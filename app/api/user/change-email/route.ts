import { auth } from "@/lib/auth";
import { handleError } from "@/lib/handle-error";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// Get the session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		const { currentEmail, newEmail } = await request.json();

		if (!currentEmail || !newEmail) {
			return Response.json({ message: "Current email and new email are required" }, { status: 400 });
		}

		// Verify that the current email matches the user's email
		if (currentEmail !== session.user.email) {
			return Response.json({ message: "Current email does not match your account email" }, { status: 400 });
		}

		// Update user email using better-auth
		// better-auth provides a changeEmail method that handles email updates
		const user = await auth.api.changeEmail({
			body: {
				newEmail: newEmail,
			},
			headers: await headers(),
		});

		return Response.json({ message: "Email updated successfully", user }, { status: 200 });
	} catch (error) {
		console.error("Error changing email:", error);
		const message = handleError(error);
		return Response.json({ message }, { status: 500 });
	}
}
