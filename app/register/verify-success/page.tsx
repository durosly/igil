import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Email verified",
	description: "Your email has been verified successfully",
};

export default function VerifySuccessPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 p-4">
			<div className="card bg-base-100 shadow-xl w-full max-w-md">
				<div className="card-body text-center">
					<div className="flex justify-center mb-4">
						<div className="relative w-20 h-20">
							<Image src="/images/logo.png" alt="IGIL Logo" fill className="object-contain" sizes="80px" />
						</div>
					</div>
					<div className="flex justify-center mb-4">
						<div className="rounded-full bg-success/20 p-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 text-success"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
					</div>
					<h1 className="text-2xl font-bold mb-2">Email verified</h1>
					<p className="text-base-content/80 mb-6">
						Your email has been verified successfully. You can now sign in to your account and register for
						programs.
					</p>
					<Link href="/login" className="btn btn-primary">
						Go to sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
