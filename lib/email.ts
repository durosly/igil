import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { InvitationEmail } from "@/emails/invitation-email";
import { VerificationEmail } from "@/emails/verification-email";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_SERVER!,
	port: Number(process.env.SMTP_PORT),
	secure: true,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
} as nodemailer.TransportOptions);

export async function sendInvitationEmail(params: {
	to: string;
	recipientName: string;
	programName: string;
	tempPassword: string;
	setPasswordUrl: string;
}) {
	const html = await render(
		InvitationEmail({
			recipientName: params.recipientName,
			programName: params.programName,
			tempPassword: params.tempPassword,
			setPasswordUrl: params.setPasswordUrl,
		})
	);

	await transporter.sendMail({
		from: `IGIL <${process.env.SMTP_USER}>`,
		to: params.to,
		subject: `You're invited to join ${params.programName} - IGIL`,
		html,
	});
}

export async function sendVerificationEmail(params: {
	to: string;
	recipientName: string;
	verificationUrl: string;
}) {
	const html = await render(
		VerificationEmail({
			recipientName: params.recipientName,
			verificationUrl: params.verificationUrl,
		})
	);

	await transporter.sendMail({
		from: `IGIL <${process.env.SMTP_USER}>`,
		to: params.to,
		subject: "Verify your email address - IGIL",
		html,
	});
}
