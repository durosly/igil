import React from "react";
import { CheckCircle, MapPin, Calendar, Building2, Award, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Our Work & Projects - IDAN GLOBAL INSPECTION LIMITED",
	description:
		"Explore IDAN's portfolio of successful NDT projects including Dangote Cement Factory, maritime vessel inspections, pipeline integrity assessments, and industrial equipment testing. See our track record of 10+ completed projects across various industries.",
	keywords: [
		"NDT projects portfolio",
		"completed projects",
		"Dangote Cement Factory",
		"maritime vessel inspection",
		"pipeline integrity assessment",
		"pressure vessel inspection",
		"structural integrity assessment",
		"ultrasonic testing projects",
		"magnetic particle inspection",
		"weld inspection projects",
		"industrial equipment testing",
		"quality control testing",
		"NDT case studies",
		"project portfolio Nigeria",
		"successful NDT projects",
		"industrial inspection projects",
		"oil and gas projects",
		"manufacturing inspection",
	],
	openGraph: {
		title: "Our Work & Projects - IDAN GLOBAL INSPECTION LIMITED",
		description:
			"Explore IDAN's portfolio of successful NDT projects including Dangote Cement Factory, maritime vessel inspections, pipeline integrity assessments, and industrial equipment testing. See our track record of 10+ completed projects across various industries.",
		url: "https://igil.net/work",
		siteName: "IDAN GLOBAL INSPECTION LIMITED",
		images: [
			{
				url: "/images/cover.png",
				width: 1200,
				height: 630,
				alt: "Our Work & Projects - IDAN GLOBAL INSPECTION LIMITED",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Our Work & Projects - IDAN GLOBAL INSPECTION LIMITED",
		description:
			"Explore IDAN's portfolio of successful NDT projects including Dangote Cement Factory, maritime vessel inspections, pipeline integrity assessments, and industrial equipment testing. See our track record of 10+ completed projects across various industries.",
		images: ["/images/cover.png"],
	},
	alternates: {
		canonical: "https://igil.net/work",
	},
};
interface JobCard {
	id: number;
	title: string;
	description: string;
	location: string;
	client: string;
	services: string[];
	year: string;
	status: "completed" | "ongoing" | "upcoming";
}

const completedJobs: JobCard[] = [
	{
		id: 1,
		title: "Ultrasonic Testing on Columns",
		description:
			"Ultrasonic testing on columns of line A and B preheated at Dangote Cement Factory Limited, Itori.",
		location: "Itori, Nigeria",
		client: "Dangote Cement Factory Limited",
		services: ["Ultrasonic Testing", "Preheating Inspection"],
		year: "2024",
		status: "completed",
	},
	{
		id: 2,
		title: "MPI and Ultrasonic Testing on Crushers",
		description: "MPI and Ultrasonic Testing on line 5 Mine 1,2,3 & 4 Crushers and pontoon.",
		location: "Mining Site",
		client: "Mining Corporation",
		services: ["Magnetic Particle Inspection", "Ultrasonic Testing"],
		year: "2024",
		status: "completed",
	},
	{
		id: 3,
		title: "Ultrasonic Flaws Detection on Vessel",
		description: "Ultrasonic flaws detection on welds on Queen Vivian Monrovia IMO 9331763 Vessel.",
		location: "Port Facility",
		client: "Maritime Vessel Company",
		services: ["Ultrasonic Testing", "Weld Inspection"],
		year: "2023",
		status: "completed",
	},
	{
		id: 4,
		title: "Comprehensive NDT Inspection",
		description: "Full spectrum non-destructive testing services for industrial equipment and structures.",
		location: "Industrial Complex",
		client: "Manufacturing Corporation",
		services: ["UT", "MPI", "DPI", "VT"],
		year: "2023",
		status: "completed",
	},
	{
		id: 5,
		title: "Pipeline Integrity Assessment",
		description: "Comprehensive pipeline integrity assessment using advanced NDT techniques.",
		location: "Oil & Gas Facility",
		client: "Energy Corporation",
		services: ["Radiographic Testing", "Ultrasonic Testing"],
		year: "2023",
		status: "completed",
	},
	{
		id: 6,
		title: "Pressure Vessel Inspection",
		description: "Thorough inspection of pressure vessels and storage tanks for safety compliance.",
		location: "Chemical Plant",
		client: "Chemical Manufacturing Ltd",
		services: ["PMI", "Hardness Testing", "VT"],
		year: "2023",
		status: "completed",
	},
];

const ongoingJobs: JobCard[] = [
	{
		id: 7,
		title: "Structural Integrity Assessment",
		description: "Ongoing structural integrity assessment for critical infrastructure components.",
		location: "Construction Site",
		client: "Infrastructure Development Corp",
		services: ["UT", "MPI", "VT"],
		year: "2024",
		status: "ongoing",
	},
	{
		id: 8,
		title: "Quality Control Testing",
		description: "Continuous quality control testing for manufacturing processes.",
		location: "Manufacturing Facility",
		client: "Industrial Manufacturing Ltd",
		services: ["DPI", "VT", "Hardness Testing"],
		year: "2024",
		status: "ongoing",
	},
];

function WorkPage() {
	return (
		<main className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="bg-white">
				<div className="container mx-auto px-4 py-16">
					<div className="text-center max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
							Our Work & Projects
						</h1>
						<p className="text-xl text-gray-600 leading-relaxed">
							Discover our track record of successful projects and ongoing
							work that demonstrates our expertise and reliability across
							various industries.
						</p>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-primary text-white py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
						<article className="flex flex-col items-center">
							<Award className="w-8 h-8 mb-2" />
							<div className="text-3xl font-bold">10+</div>
							<div className="text-sm opacity-90">Completed Projects</div>
						</article>
						<article className="flex flex-col items-center">
							<Users className="w-8 h-8 mb-2" />
							<div className="text-3xl font-bold">25+</div>
							<div className="text-sm opacity-90">Happy Clients</div>
						</article>
						<article className="flex flex-col items-center">
							<Building2 className="w-8 h-8 mb-2" />
							<div className="text-3xl font-bold">10+</div>
							<div className="text-sm opacity-90">Industries Served</div>
						</article>
						<article className="flex flex-col items-center">
							<TrendingUp className="w-8 h-8 mb-2" />
							<div className="text-3xl font-bold">8+</div>
							<div className="text-sm opacity-90">Years Experience</div>
						</article>
					</div>
				</div>
			</section>

			{/* Completed Jobs Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
						Completed Projects
					</h2>
					<p className="text-lg text-gray-700 max-w-3xl mx-auto">
						Our track record of successful projects demonstrates our expertise and
						reliability across various industries.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{completedJobs.map((job) => (
						<article
							key={job.id}
							itemScope
							itemType="https://schema.org/Project"
							className="bg-white border border-gray-100">
							<div className="p-6">
								<div className="flex max-md:flex-col max-md:gap-2 md:items-start md:justify-between mb-4">
									<div className="flex max-sm:flex-col max-sm:gap-2 md:items-center">
										<div className="size-10 flex-shrink-0 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
											{job.id}
										</div>
										<div>
											<h3
												itemProp="name"
												className="sm:text-xl font-semibold text-gray-900">
												{job.title}
											</h3>
											<div className="flex items-center text-sm text-gray-600 mt-1">
												<MapPin className="w-4 h-4 mr-1" />
												<span itemProp="location">
													{job.location}
												</span>
											</div>
										</div>
									</div>
									<div className="flex items-center">
										<CheckCircle className="w-5 h-5 text-green-500 mr-1" />
										<span className="text-sm text-green-600 font-medium">
											Completed
										</span>
									</div>
								</div>

								<p
									itemProp="description"
									className="text-gray-700 mb-4 leading-relaxed">
									{job.description}
								</p>

								<div className="space-y-3">
									<div className="flex items-center text-sm text-gray-600">
										<Building2 className="w-4 h-4 mr-2" />
										<span className="font-medium">
											Client:
										</span>
										<span
											itemProp="sponsor"
											className="ml-1">
											{job.client}
										</span>
									</div>

									<div className="flex items-center text-sm text-gray-600">
										<Calendar className="w-4 h-4 mr-2" />
										<span className="font-medium">
											Year:
										</span>
										<span
											itemProp="startDate"
											className="ml-1">
											{job.year}
										</span>
									</div>

									<div className="flex flex-wrap gap-2 mt-3">
										{job.services.map((service, index) => (
											<span
												key={index}
												itemProp="keywords"
												className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
												{service}
											</span>
										))}
									</div>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Ongoing Projects Section */}
			<div className="bg-white py-16 hidden">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
							Ongoing Projects
						</h2>
						<p className="text-lg text-gray-700 max-w-3xl mx-auto">
							Currently working on projects that showcase our commitment to
							quality and safety.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{ongoingJobs.map((job) => (
							<div
								key={job.id}
								className="bg-gray-50 border border-gray-200 hover:border-primary/30 transition-colors duration-300">
								<div className="p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center">
											<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
												{job.id}
											</div>
											<div>
												<h3 className="text-xl font-semibold text-gray-900">
													{job.title}
												</h3>
												<div className="flex items-center text-sm text-gray-600 mt-1">
													<MapPin className="w-4 h-4 mr-1" />
													{job.location}
												</div>
											</div>
										</div>
										<div className="flex items-center">
											<div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
											<span className="text-sm text-blue-600 font-medium">
												In Progress
											</span>
										</div>
									</div>

									<p className="text-gray-700 mb-4 leading-relaxed">
										{job.description}
									</p>

									<div className="space-y-3">
										<div className="flex items-center text-sm text-gray-600">
											<Building2 className="w-4 h-4 mr-2" />
											<span className="font-medium">
												Client:
											</span>
											<span className="ml-1">
												{job.client}
											</span>
										</div>

										<div className="flex items-center text-sm text-gray-600">
											<Calendar className="w-4 h-4 mr-2" />
											<span className="font-medium">
												Year:
											</span>
											<span className="ml-1">
												{job.year}
											</span>
										</div>

										<div className="flex flex-wrap gap-2 mt-3">
											{job.services.map(
												(service, index) => (
													<span
														key={
															index
														}
														className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
														{
															service
														}
													</span>
												)
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Call to Action */}
			<section className="bg-gray-100 py-16">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Ready to Start Your Project?
						</h2>
						<p className="text-lg text-gray-600 mb-8">
							Let&apos;s discuss how we can help with your next NDT project.
							Our experienced team is ready to ensure the safety and quality
							of your infrastructure.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/contact-us" className="btn btn-primary btn-lg">
								Get Started Today
							</Link>
							<Link href="/services" className="btn btn-outline btn-lg">
								View Our Services
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default WorkPage;
