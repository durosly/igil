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

interface InvitationEmailProps {
	recipientName: string;
	programName: string;
	tempPassword: string;
	setPasswordUrl: string;
}

export function InvitationEmail({
	recipientName,
	programName,
	tempPassword,
	setPasswordUrl,
}: InvitationEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>You have been invited to join {programName} - IGIL</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>Welcome to IGIL</Heading>
					<Text style={text}>Hello {recipientName},</Text>
					<Text style={text}>
						You have been invited to join the program: <strong>{programName}</strong>.
					</Text>
					<Text style={text}>
						Please use the temporary password below to sign in. You will be required to change your
						password on first login.
					</Text>
					<Section style={passwordSection}>
						<Text style={passwordLabel}>Temporary Password:</Text>
						<Text style={passwordValue}>{tempPassword}</Text>
					</Section>
					<Button style={button} href={setPasswordUrl}>
						Set Your Password
					</Button>
					<Hr style={hr} />
					<Text style={footer}>If you did not expect this invitation, please ignore this email.</Text>
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

const passwordSection = {
	backgroundColor: "#f8fafc",
	borderRadius: "8px",
	padding: "16px",
	margin: "24px 0",
};

const passwordLabel = {
	color: "#64748b",
	fontSize: "14px",
	margin: "0 0 8px",
};

const passwordValue = {
	color: "#1a1a1a",
	fontSize: "18px",
	fontWeight: "600",
	fontFamily: "monospace",
	margin: "0",
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
