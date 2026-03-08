import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import CertificatesManager from "./__components/certificates-manager";

export const metadata: Metadata = {
	title: "Certificates",
	description: "Manage certificates and unlock downloads",
};

export default async function AdminCertificatesPage() {
	await connectDB();
	const certificates = await Certificate.find()
		.populate("programId", "title")
		.populate("sessionId", "title year")
		.lean();

	return (
		<div>
			<h1 className="text-4xl font-bold mb-6">Certificates</h1>
			<CertificatesManager initialCertificates={JSON.parse(JSON.stringify(certificates))} />
		</div>
	);
}
