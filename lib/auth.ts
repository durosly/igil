import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins/admin";
import { getClient } from "./db";
import { sendVerificationEmail } from "./email";

const db = await getClient();

const baseURL = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
	database: mongodbAdapter(db),
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
		// async sendVerificationEmail(data: { user: { email: string; name?: string }; url: string }) {
		// 	console.log("Sending verification email to", data.user.email);
		// 	console.log("Verification URL", data.url);
		// 	await sendVerificationEmail({
		// 		to: data.user.email,
		// 		recipientName: data.user.name ?? data.user.email,
		// 		verificationUrl: data.url,
		// 	});
		// },
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			// console.log("Sending verification email to", user.email, token);
			// console.log("Verification URL", url);
			void sendVerificationEmail({
				to: user.email,
				recipientName: user.name ?? user.email,
				verificationUrl: url,
			});
		},
		sendOnSignIn: true
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	baseURL: baseURL ?? "http://localhost:3000",
	basePath: "/api/auth",
	secret: process.env.BETTER_AUTH_SECRET!,
	plugins: [admin({ defaultRole: "student" })],
});

export type Session = typeof auth.$Infer.Session;
