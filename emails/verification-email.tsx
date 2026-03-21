import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

// Logo from remote origin: https://github.com/durosly/igil (raw GitHub)
const LOGO_URL =
	"https://raw.githubusercontent.com/durosly/igil/main/public/images/logo.png";

interface VerificationEmailProps {
	recipientName: string;
	verificationUrl: string;
}

export function VerificationEmail({ recipientName, verificationUrl }: VerificationEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Verify your email address - IGIL</Preview>
			<Tailwind>
				<Body className="m-0 bg-slate-100 font-sans">
					<Container className="mx-auto my-0 max-w-lg rounded-xl bg-white p-8 shadow-sm">
						<Section className="mb-6 text-center">
							<Img
								src={LOGO_URL}
								alt="IGIL - IDAN Global Integrated Limited"
								width={140}
								height={48}
								className="mx-auto h-12 w-auto"
							/>
						</Section>
						<Heading className="m-0 mb-4 text-2xl font-semibold text-red-600">
							Verify your email
						</Heading>
						<Text className="m-0 mb-4 text-base leading-6 text-slate-600">
							Hello {recipientName},
						</Text>
						<Text className="m-0 mb-6 text-base leading-6 text-slate-600">
							Please verify your email address by clicking the button below. This will
							allow you to access your student dashboard and register for programs.
						</Text>
						<Section className="my-6 text-center">
							<Button
								className="inline-block rounded-lg bg-red-600 px-6 py-3 text-base font-semibold text-white no-underline"
								href={verificationUrl}
							>
								Verify Email Address
							</Button>
						</Section>
						<Hr className="my-6 border-slate-200" />
						<Text className="m-0 text-xs leading-5 text-slate-500">
							If you did not create an account, please ignore this email.
						</Text>
						<Text className="mt-4 text-center text-xs text-slate-400">
							IDAN Global Integrated Limited · Leading NDT Services in Nigeria
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
