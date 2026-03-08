import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Verify your email",
	description: "Check your email to verify your account",
};

export default function VerifyEmailPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 p-4">
			<div className="card bg-base-100 shadow-xl w-full max-w-md">
				<div className="card-body text-center">
					<h1 className="text-2xl font-bold mb-2">Check your email</h1>
					<p className="text-base-content/80 mb-6">
						We sent you a verification link. Click the link in the email to verify your account, then you can sign in.
					</p>
					<Link href="/login" className="btn btn-primary">
						Go to sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
