import { Award, Clock, Globe, Mail, MapPin, Phone, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Nationwide Coverage - IDAN GLOBAL INTEGRATED LIMITED",
	description:
		"IDAN provides comprehensive NDT services across all 36 states of Nigeria. From Lagos to Abuja, Port Harcourt to Kano, we offer nationwide coverage with local expertise, rapid response, and consistent quality standards.",
	keywords: [
		"NDT services Nigeria",
		"nationwide coverage",
		"Lagos NDT services",
		"Abuja inspection services",
		"Port Harcourt NDT",
		"Kano industrial inspection",
		"South-West Nigeria",
		"South-South Nigeria",
		"North-Central Nigeria",
		"South-East Nigeria",
		"North-East Nigeria",
		"North-West Nigeria",
		"oil and gas inspection Nigeria",
		"industrial inspection nationwide",
		"NDT technicians Nigeria",
		"emergency response NDT",
		"local expertise Nigeria",
		"rapid response inspection",
	],
	openGraph: {
		title: "Nationwide Coverage - IDAN GLOBAL INTEGRATED LIMITED",
		description:
			"IDAN provides comprehensive NDT services across all 36 states of Nigeria. From the bustling ports of Lagos to the industrial heartlands of the Niger Delta, from the political capital of Abuja to the emerging cities of the North, we ensure quality and safety wherever you operate.",
		url: "https://igil.net/locations",
		siteName: "IDAN GLOBAL INTEGRATED LIMITED",
		images: [
			{
				url: "/images/cover.png",
				width: 1200,
				height: 630,
				alt: "Nationwide Coverage - IDAN GLOBAL INTEGRATED LIMITED",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Nationwide Coverage - IDAN GLOBAL INTEGRATED LIMITED",
		description:
			"IDAN provides comprehensive NDT services across all 36 states of Nigeria. From the bustling ports of Lagos to the industrial heartlands of the Niger Delta, from the political capital of Abuja to the emerging cities of the North, we ensure quality and safety wherever you operate.",
		images: ["/images/cover.png"],
	},
	alternates: {
		canonical: "https://igil.net/locations",
	},
};

// Major Nigerian cities and regions where IDAN operates
const locations = [
	{
		region: "South-West",
		cities: ["Lagos", "Ibadan", "Abeokuta", "Akure", "Ado-Ekiti", "Ondo"],
		description: "Major industrial and commercial hub with extensive oil & gas operations",
	},
	{
		region: "South-South",
		cities: ["Port Harcourt", "Warri", "Calabar", "Yenagoa", "Uyo", "Asaba"],
		description: "Heart of Nigeria's oil and gas industry with critical infrastructure",
	},
	{
		region: "North-Central",
		cities: ["Abuja", "Jos", "Kano", "Kaduna", "Zaria", "Minna"],
		description: "Political capital and key manufacturing centers",
	},
	{
		region: "South-East",
		cities: ["Enugu", "Onitsha", "Awka", "Abakaliki", "Owerri", "Umuahia"],
		description: "Industrial and commercial centers with growing infrastructure",
	},
	{
		region: "North-East",
		cities: ["Maiduguri", "Yola", "Gombe", "Bauchi", "Jalingo", "Damaturu"],
		description: "Emerging industrial zones with strategic importance",
	},
	{
		region: "North-West",
		cities: ["Kano", "Katsina", "Sokoto", "Kebbi", "Zamfara", "Jigawa"],
		description: "Agricultural and manufacturing centers with expanding infrastructure",
	},
];

const stats = [
	{ icon: MapPin, value: "32+", label: "States Covered" },
	{ icon: Users, value: "50+", label: "Expert Technicians" },
	{ icon: Award, value: "8+", label: "Years Experience" },
	{ icon: Globe, value: "10+", label: "Projects Completed" },
];

function LocationsPage() {
	return (
		<main className="min-h-screen bg-base-200">
			{/* Hero Section */}
			<section className="relative py-20">
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">Nationwide Coverage</h1>
					<p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-4xl mx-auto">
						IDAN GLOBAL INTEGRATED LIMITED provides comprehensive NDT services
						across all 36 states of Nigeria, ensuring quality and safety wherever
						you operate.
					</p>

					{/* Stats Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
						{stats.map((stat, index) => {
							const IconComponent = stat.icon;
							return (
								<article
									key={index}
									itemScope
									itemType="https://schema.org/Organization"
									className="bg-white p-6 border border-base-300">
									<div className="flex flex-col items-center">
										<IconComponent className="w-8 h-8 text-primary mb-2" />
										<div
											itemProp="numberOfEmployees"
											className="text-3xl font-bold">
											{stat.value}
										</div>
										<div className="text-sm text-gray-800 text-center">
											{stat.label}
										</div>
									</div>
								</article>
							);
						})}
					</div>
				</div>
			</section>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Coverage Overview */}
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-base-content mb-6">
						Complete National Coverage
					</h2>
					<p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
						From the bustling ports of Lagos to the industrial heartlands of the
						Niger Delta, from the political capital of Abuja to the emerging cities
						of the North, IDAN is your trusted partner for NDT services across
						Nigeria.
					</p>
				</div>

				{/* Regional Coverage Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					{locations.map((location, index) => (
						<article
							key={index}
							itemScope
							itemType="https://schema.org/Place"
							className="bg-base-100 p-6 border border-base-300 hover:shadow-md transition-all duration-300">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 bg-primary/20 flex items-center justify-center mr-4">
									<MapPin className="w-6 h-6 text-primary" />
								</div>
								<h3
									itemProp="name"
									className="text-xl font-bold text-base-content">
									{location.region}
								</h3>
							</div>
							<p itemProp="description" className="text-base-content/70 mb-4">
								{location.description}
							</p>
							<div className="flex flex-wrap gap-2">
								{location.cities.map((city, cityIndex) => (
									<span
										key={cityIndex}
										itemProp="addressLocality"
										className="px-3 py-1 bg-primary/10 text-primary text-sm">
										{city}
									</span>
								))}
							</div>
						</article>
					))}
				</div>

				{/* Service Availability */}
				<div className="bg-base-100 p-8 mb-16">
					<h2 className="text-3xl font-bold text-base-content mb-8 text-center">
						Services Available Nationwide
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{ name: "Ultrasonic Testing", icon: "🔍" },
							{ name: "Magnetic Particle Inspection", icon: "🧲" },
							{ name: "Dye Penetrant Inspection", icon: "💧" },
							{ name: "Radiographic Testing", icon: "📷" },
							{ name: "Visual Testing", icon: "👁️" },
							{ name: "Positive Material Identification", icon: "🧪" },
							{ name: "Hardness Testing", icon: "⚡" },
							{ name: "Equipment Sales", icon: "🛠️" },
						].map((service, index) => (
							<div
								key={index}
								className="flex items-center space-x-3 p-4 bg-base-200">
								<span className="text-2xl">{service.icon}</span>
								<span className="font-medium text-base-content">
									{service.name}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Why Choose IDAN for Nationwide Coverage */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
					<div>
						<h2 className="text-3xl font-bold text-base-content mb-6">
							Why Choose IDAN for Nationwide Coverage?
						</h2>
						<div className="space-y-6">
							{[
								{
									title: "Local Expertise",
									description:
										"Our technicians are familiar with local conditions, regulations, and industry standards across Nigeria.",
								},
								{
									title: "Rapid Response",
									description:
										"With teams strategically located across the country, we can respond quickly to urgent inspection needs.",
								},
								{
									title: "Consistent Quality",
									description:
										"Same high standards and procedures applied nationwide, ensuring consistent results regardless of location.",
								},
								{
									title: "Cost Effective",
									description:
										"Local presence reduces travel costs and project delays, providing better value for your investment.",
								},
							].map((benefit, index) => (
								<div key={index} className="flex space-x-4">
									<div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
										<span className="text-white font-bold text-sm">
											{index + 1}
										</span>
									</div>
									<div>
										<h3 className="font-semibold text-base-content mb-2">
											{benefit.title}
										</h3>
										<p className="text-base-content/70">
											{benefit.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8">
						<h3 className="text-2xl font-bold text-base-content mb-6">
							Ready to Get Started?
						</h3>
						<p className="text-base-content/70 mb-6">
							No matter where your project is located in Nigeria, IDAN is
							ready to serve you. Contact us today to discuss your specific
							requirements and get a customized quote.
						</p>
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<Phone className="w-5 h-5 text-primary" />
								<span className="text-base-content">
									+2349034840287
								</span>
							</div>
							<div className="flex items-center space-x-3">
								<Mail className="w-5 h-5 text-primary" />
								<span className="text-base-content">info@igil.net</span>
							</div>
							<div className="flex items-center space-x-3">
								<Clock className="w-5 h-5 text-primary" />
								<span className="text-base-content">
									24/7 Emergency Response Available
								</span>
							</div>
						</div>
						<Link href="/contact-us" className="btn btn-primary mt-6 w-full">
							Contact Us Today
						</Link>
					</div>
				</div>

				{/* Call to Action */}
				<div className="text-center bg-base-100 p-8">
					<h2 className="text-3xl font-bold text-base-content mb-4">
						Your Trusted Partner Across Nigeria
					</h2>
					<p className="text-xl text-base-content/70 mb-6 max-w-2xl mx-auto">
						From the Atlantic coast to the Sahel, IDAN ensures your projects meet
						the highest standards of safety and quality. Experience nationwide
						coverage with local expertise.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/contact-us" className="btn btn-primary">
							Request a Quote
						</Link>
						<Link href="/services" className="btn btn-outline">
							View Our Services
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}

export default LocationsPage;
