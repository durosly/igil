import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CertificatesList from "./__components/certificates-list";

export const metadata: Metadata = {
	title: "My Certificates",
	description: "Download your certificates",
};

export default async function StudentCertificatesPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	const userId = session!.user!.id;

	await connectDB();
	const certificates = await Certificate.find({ userId })
		.populate("programId", "title")
		.populate("sessionId", "title year")
		.lean();

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">My Certificates</h1>
			<CertificatesList certificates={JSON.parse(JSON.stringify(certificates))} />
		</div>
	);
}
