import CertificateLookupClient from "./__components/certificate-lookup-client";
import { Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Verify certificate",
	description:
		"Look up IGIL training certificates by certificate number or the full name on record. Confirm program completion and certificate details.",
	openGraph: {
		title: "Verify certificate — IGIL",
		description:
			"Look up IGIL training certificates by certificate number or registered full name.",
	},
};

export default async function VerifyCertificatePage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const { q } = await searchParams;
	const initialQuery = q?.trim() ?? "";

	return (
		<div className="min-h-screen bg-base-100">
			<section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex justify-center mb-6">
						<div className="bg-primary/20 p-4 rounded-full">
							<Award className="w-12 h-12 text-primary" />
						</div>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Certificate verification
					</h1>
					<p className="text-lg text-gray-700 max-w-2xl mx-auto">
						Enter your certificate number or your full name exactly as registered to view programs
						and certificate details we have on file.
					</p>
				</div>
			</section>

			<CertificateLookupClient initialQuery={initialQuery} />
		</div>
	);
}
