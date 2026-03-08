import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins/admin";
import { getClient } from "./db";
import { sendVerificationEmail } from "./email";

const db = await getClient();

const baseURL = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
	database: mongodbAdapter(db),
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			// Public sign-up must never set role to admin; only admin create-user can.
			if ((ctx.path === "sign-up/email" || ctx.path === "/sign-up/email") && ctx.body && typeof ctx.body === "object") {
				return {
					context: {
						...ctx,
						body: { ...ctx.body, role: "student" },
					},
				};
			}
		}),
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "student",
			},
			mustChangePassword: {
				type: "boolean",
				required: false,
				defaultValue: false,
			},
			profileApproved: {
				type: "boolean",
				required: false,
				defaultValue: false,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendVerificationOnSignIn: true,
		disableSignUp: false,
		async sendVerificationEmail(data: { user: { email: string; name?: string }; url: string }) {
			await sendVerificationEmail({
				to: data.user.email,
				recipientName: data.user.name ?? data.user.email,
				verificationUrl: data.url,
			});
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	baseURL: baseURL ?? "http://localhost:3000",
	basePath: "/api/auth",
	secret: process.env.BETTER_AUTH_SECRET!,
	plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;
