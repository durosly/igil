import type { Metadata } from "next";
import connectDB from "@/lib/db";
import Program from "@/models/Program";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/app/components/section-header";

export const metadata: Metadata = {
	title: "Programs",
	description: "Browse our programs",
};

export default async function PublicProgramsPage() {
	await connectDB();
	const programs = await Program.find({ status: "active" }).sort({ title: 1 }).lean();

	return (
		<>
			<SectionHeader />
			<section className="container mx-auto px-4 py-12">
				<h2 className="text-3xl font-bold mb-8">Our Programs</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{programs.map((p) => (
						<article key={String(p._id)} className="card bg-base-100 shadow-xl overflow-hidden">
							<figure className="relative aspect-video w-full bg-base-200">
								{p.coverImageUrl ? (
									<Image
										src={p.coverImageUrl}
										alt={p.title}
										fill
										className="object-cover"
										sizes="(max-width: 768px) 100vw, 33vw"
									/>
								) : (
									<div className="flex items-center justify-center text-base-content/40 w-full h-full">
										No image
									</div>
								)}
							</figure>
							<div className="card-body">
								<h3 className="card-title">{p.title}</h3>
								<p className="line-clamp-3">{p.description}</p>
								<div className="card-actions justify-end">
									<Link href="/register" className="btn btn-primary">
										Register as student
									</Link>
								</div>
							</div>
						</article>
					))}
				</div>
				{programs.length === 0 && (
					<p className="text-center text-base-content/70 py-12">No programs available at the moment.</p>
				)}
			</section>
		</>
	);
}
