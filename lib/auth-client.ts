"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
	plugins: [
		adminClient(),
		inferAdditionalFields({
			user: {
				role: { type: "string", required: true },
				mustChangePassword: { type: "boolean", required: false },
				profileApproved: { type: "boolean", required: false },
			},
		}),
	],
});

export const { signIn, signUp, signOut, useSession } = authClient;
