import { auth } from "@/lib/auth";

export async function GET() {
	try {
		await auth.api.signUpEmail({
			body: {
				name: "Admin Test",
				email: "test@example.com",
				password: "nice1234",
			},
		});

		return Response.json({ message: "green" });
	} catch (error) {
		return Response.json({ error });
	}
}
