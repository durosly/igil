import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface VerificationEmailProps {
	recipientName: string;
	verificationUrl: string;
}

export function VerificationEmail({ recipientName, verificationUrl }: VerificationEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Verify your email address - IGIL</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>Verify your email</Heading>
					<Text style={text}>Hello {recipientName},</Text>
					<Text style={text}>
						Please verify your email address by clicking the button below. This will allow you to
						access your student dashboard and register for programs.
					</Text>
					<Button style={button} href={verificationUrl}>
						Verify Email Address
					</Button>
					<Hr style={hr} />
					<Text style={footer}>
						If you did not create an account, please ignore this email.
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

const main = {
	backgroundColor: "#f6f9fc",
	fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "40px 20px",
	marginBottom: "64px",
};

const h1 = {
	color: "#1a1a1a",
	fontSize: "24px",
	fontWeight: "600",
	lineHeight: "1.3",
	margin: "0 0 24px",
};

const text = {
	color: "#525f7f",
	fontSize: "16px",
	lineHeight: "1.6",
	margin: "0 0 16px",
};

const button = {
	backgroundColor: "#0f172a",
	borderRadius: "8px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "600",
	textDecoration: "none",
	textAlign: "center" as const,
	padding: "12px 24px",
	margin: "24px 0",
	display: "block",
};

const hr = {
	borderColor: "#e6ebf1",
	margin: "24px 0",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
	lineHeight: "1.5",
	margin: "0",
};
