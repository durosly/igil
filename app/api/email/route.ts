import arcjet, { detectBot, fixedWindow, shield, validateEmail } from "@arcjet/next";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_SERVER!,
	port: process.env.SMTP_PORT,
	secure: true, // upgrade later with STARTTLS
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
} as nodemailer.TransportOptions);

const aj = arcjet({
	key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
	rules: [
		// Shield protects your app from common attacks e.g. SQL injection
		shield({ mode: "LIVE" }),
		// Create a bot detection rule
		detectBot({
			mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
			// Block all bots except the following
			allow: [
				//   "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
				// Uncomment to allow these other common bot categories
				// See the full list at https://arcjet.com/bot-list
				//"CATEGORY:MONITOR", // Uptime monitoring services
				//"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
			],
		}),
		validateEmail({
			mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
			// block disposable, invalid, and email addresses with no MX records
			deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
		}),
		fixedWindow({
			mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
			window: "1d", // 24 hrs fixed window
			max: 2, // allow a maximum of 2 requests
		}),
	],
});

async function sendEamil(request: Request) {
	try {
		const { name, email, phone, message } = await request.json();
		const decision = await aj.protect(request, { email });

		// Handle Arcjet protection decisions
		if (decision.isDenied()) {
			// Log the denial reason for debugging
			console.log("Request denied by Arcjet:", decision.reason);

			if (decision.reason.isShield()) {
				return Response.json({ message: "Cooling server off" }, { status: 403 });
			}

			if (decision.reason.isBot()) {
				return Response.json({ message: "Bot requests are not allowed" }, { status: 403 });
			}

			if (decision.reason.isEmail()) {
				return Response.json({ message: "Invalid email address provided" }, { status: 400 });
			}

			if (decision.reason.isRateLimit()) {
				return Response.json(
					{ message: "Too many requests. Please try again later." },
					{ status: 429 }
				);
			}

			// Generic denial response
			return Response.json({ message: "Request blocked for security reasons" }, { status: 403 });
		}

		// If decision is allowed, continue with the request processing
		if (!decision.isAllowed()) {
			// Handle any other decision states (like pending, etc.)
			return Response.json({ message: "Request processing error" }, { status: 500 });
		}

		if (!name) {
			return Response.json({ message: "Please, tell us your name" }, { status: 400 });
		}

		if (!email) {
			return Response.json({ message: "We need your email so we can contact you" }, { status: 400 });
		}

		if (!message) {
			return Response.json({ message: "What are you trying to tell us?" }, { status: 400 });
		}

		let emailMsg = `<p>Name: ${name}</p>`;

		if (!!phone) {
			emailMsg += `<p>Phone: ${phone}</p>`;
		}

		emailMsg += `<p>Email: ${email}</p> <br /> <br />`;

		emailMsg += `<p>Message: </p> <br />`;
		emailMsg += message;

		await transporter.verify();

		const info = await transporter.sendMail({
			from: `[site message] <${process.env.SMTP_USER}>`, // Header From:
			to: `Admin <${process.env.SMTP_USER}>`, // Header To:
			envelope: {
				from: `[site message] (${name}) <${process.env.SMTP_USER}>`, // MAIL FROM:
				to: [process.env.SMTP_USER!],
			},
			subject: `site message by ${name} with email ${email} - ${new Date().toLocaleString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: true,
			})}`,
			text: message,
			html: emailMsg,
		});

		console.log(info);

		return Response.json({ message: "Success" });
	} catch (error) {
		let message = "Something went wrong";
		if (error instanceof Error) {
			message = error.message;
		}

		return Response.json({ message }, { status: 500 });
	}
}

export { sendEamil as POST };
