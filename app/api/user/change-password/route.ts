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

		const { currentPassword, newPassword } = await request.json();

		if (!currentPassword || !newPassword) {
			return Response.json({ message: "Current password and new password are required" }, { status: 400 });
		}

		if (newPassword.length < 8) {
			return Response.json({ message: "New password must be at least 8 characters long" }, { status: 400 });
		}

		// Update user password using better-auth

		const user = await auth.api.changePassword({
			body: {
				currentPassword,
				newPassword,
			},

			headers: await headers(),
		});

		return Response.json({ message: "Password updated successfully", user }, { status: 200 });
	} catch (error) {
		console.error("Error changing password:", error);
		const message = handleError(error);

		console.log(message);

		return Response.json({ message }, { status: 500 });
	}
}
