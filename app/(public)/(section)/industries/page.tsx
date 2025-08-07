import React from "react";
import { Building2, Store, GraduationCap, Zap, Shield, Stethoscope, Hotel, Cog, Fuel, Microscope } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Industries We Serve - IDAN GLOBAL INSPECTION LIMITED",
	description:
		"IDAN serves diverse industries including Oil & Gas, Industrial, Healthcare, Education, Energy & Utility, Federal Government, Hospitality, Commercial & Retail, Civic & Local Government, and Science & Technology sectors with comprehensive NDT services.",
	keywords: [
		"oil and gas industry",
		"industrial inspection",
		"healthcare facilities",
		"educational institutions",
		"energy and utility",
		"federal government",
		"hospitality sector",
		"commercial retail",
		"civic government",
		"science technology",
		"petrochemical industry",
		"refinery services",
		"industrial engineering",
		"multidiscipline solutions",
		"infrastructure inspection",
		"NDT services by industry",
		"industrial solutions Nigeria",
	],
	openGraph: {
		title: "Industries We Serve - IDAN GLOBAL INSPECTION LIMITED",
		description:
			"IDAN operates across diverse sectors including Oil & Gas, Industrial, Healthcare, Education, Energy & Utility, Federal Government, Hospitality, Commercial & Retail, Civic & Local Government, and Science & Technology with innovative solutions and exceptional results.",
		url: "https://igil.net/industries",
		siteName: "IDAN GLOBAL INSPECTION LIMITED",
		images: [
			{
				url: "/images/cover.png",
				width: 1200,
				height: 630,
				alt: "Industries We Serve - IDAN GLOBAL INSPECTION LIMITED",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Industries We Serve - IDAN GLOBAL INSPECTION LIMITED",
		description:
			"IDAN operates across diverse sectors including Oil & Gas, Industrial, Healthcare, Education, Energy & Utility, Federal Government, Hospitality, Commercial & Retail, Civic & Local Government, and Science & Technology with innovative solutions and exceptional results.",
		images: ["/images/cover.png"],
	},
	alternates: {
		canonical: "https://igil.net/industries",
	},
};

interface IndustryCard {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	color: string;
}

const industries: IndustryCard[] = [
	{
		id: "civic",
		title: "CIVIC & LOCAL GOVERNMENT",
		description:
			"Designs that fit the community and budget. IDAN provides local, regional, and federal solutions with expertise in public infrastructure and government facilities.",
		icon: <Building2 className="w-8 h-8" />,
		color: "text-orange-500",
	},
	{
		id: "commercial",
		title: "COMMERCIAL & RETAIL",
		description:
			"Let us help you express your signature. Whether a high technology facility with cutting-edge design or a retail space that captures your brand essence.",
		icon: <Store className="w-8 h-8" />,
		color: "text-gray-600",
	},
	{
		id: "education",
		title: "EDUCATION",
		description:
			"Results that pass the test. Whether rural or urban, public or private, K-12, higher education, or specialized training facilities.",
		icon: <GraduationCap className="w-8 h-8" />,
		color: "text-orange-500",
	},
	{
		id: "energy",
		title: "ENERGY & UTILITY",
		description:
			"Energy. It matters. From providing sustainable power designs for remote locations to comprehensive utility infrastructure solutions.",
		icon: <Zap className="w-8 h-8" />,
		color: "text-orange-500",
	},
	{
		id: "federal",
		title: "FEDERAL",
		description:
			"Lasting solutions for Federal facilities. IDAN has decades of experience meeting the special requirements of government projects.",
		icon: <Shield className="w-8 h-8" />,
		color: "text-orange-500",
	},
	{
		id: "healthcare",
		title: "HEALTHCARE",
		description:
			"Smart, practical, efficient solutions that care. At IDAN, we have seen the evolving needs of healthcare facilities and design accordingly.",
		icon: <Stethoscope className="w-8 h-8" />,
		color: "text-orange-500",
	},
	{
		id: "hospitality",
		title: "HOSPITALITY & HOUSING",
		description:
			"Welcome home. Let our team help you achieve your vision. At IDAN, we create spaces that make guests feel at home.",
		icon: <Hotel className="w-8 h-8" />,
		color: "text-orange-500",
	},
	{
		id: "industrial",
		title: "INDUSTRIAL",
		description:
			"Creativity and multidiscipline integration. Our multidiscipline team of industrial engineers provides services to optimize your operations.",
		icon: <Cog className="w-8 h-8" />,
		color: "text-orange-500",
	},
	{
		id: "oil-gas",
		title: "OIL, GAS, REFINERY, & PETROCHEMICAL",
		description:
			"Design experience as broad as it is deep. For decades, producers of all sizes have trusted IDAN for their critical infrastructure needs.",
		icon: <Fuel className="w-8 h-8" />,
		color: "text-orange-500",
	},
	{
		id: "science",
		title: "SCIENCE & TECHNOLOGY",
		description:
			"Designing spaces that facilitate scientific innovation and discovery. Technical Design Excellence From research labs to innovation centers.",
		icon: <Microscope className="w-8 h-8" />,
		color: "text-orange-500",
	},
];

function IndustriesPage() {
	return (
		<main className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="bg-white">
				<div className="container mx-auto px-4 py-16">
					<div className="text-center max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
							Industries We Serve
						</h1>
						<p className="text-xl text-gray-600 leading-relaxed">
							IDAN operates across diverse sectors, delivering innovative
							solutions and exceptional results for clients in every industry
							we serve.
						</p>
					</div>
				</div>
			</section>

			{/* Industries Grid */}
			<section className="container mx-auto px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
					{industries.map((industry) => (
						<article
							key={industry.id}
							itemScope
							itemType="https://schema.org/Service"
							className="bg-white rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
							<div className="flex flex-col items-center text-center h-full">
								<div className={`mb-4 ${industry.color}`}>
									{industry.icon}
								</div>
								<h3
									itemProp="name"
									className={`font-bold text-sm mb-3 ${industry.color}`}>
									{industry.title}
								</h3>
								<p
									itemProp="description"
									className="text-gray-600 text-xs leading-relaxed">
									{industry.description}
								</p>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Call to Action */}
			<section className="bg-white border-t border-gray-100">
				<div className="container mx-auto px-4 py-16">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Ready to Work Together?
						</h2>
						<p className="text-lg text-gray-600 mb-8">
							Let&apos;s discuss how IDAN can help with your next project,
							regardless of the industry or complexity.
						</p>
						<button className="btn btn-primary btn-lg">Get Started Today</button>
					</div>
				</div>
			</section>
		</main>
	);
}

export default IndustriesPage;
