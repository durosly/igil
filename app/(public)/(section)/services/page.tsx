import VideoPlayer from "@/app/components/video-player";
import { Eye, HardHat, Magnet, Monitor, Radio, ShoppingCart, TestTube, Waves } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "NDT Services",
	description:
		"Comprehensive Non-Destructive Testing (NDT) services including UT, MPI, DPI, RT/RFI, VT/VE, PMI, Hardness Testing, and NDT equipment sales. ISO 9712 and ASNT Level II certified professionals in Nigeria.",
	keywords: [
		"NDT services",
		"Ultrasonic Testing UT",
		"Magnetic Particle Inspection MPI",
		"Dye Penetrant Inspection DPI",
		"Radiographic Testing RT",
		"Visual Testing VT",
		"Positive Material Identification PMI",
		"Hardness Testing",
		"NDT equipment sales",
		"ISO 9712 certified",
		"ASNT Level II",
		"Industrial inspection services",
	],
	openGraph: {
		title: "NDT Services - IDAN GLOBAL INTEGRATED LIMITED",
		description:
			"Comprehensive Non-Destructive Testing (NDT) services including UT, MPI, DPI, RT/RFI, VT/VE, PMI, Hardness Testing, and NDT equipment sales.",
		url: "https://igil.net/services",
		siteName: "IDAN GLOBAL INTEGRATED LIMITED",
		images: [
			{
				url: "/images/cover.png",
				width: 1200,
				height: 630,
				alt: "NDT Services - IDAN GLOBAL INTEGRATED LIMITED",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "NDT Services - IDAN GLOBAL INTEGRATED LIMITED",
		description:
			"Comprehensive Non-Destructive Testing (NDT) services including UT, MPI, DPI, RT/RFI, VT/VE, PMI, Hardness Testing, and NDT equipment sales.",
		images: ["/images/cover.png"],
	},
	alternates: {
		canonical: "https://igil.net/services",
	},
};

const services = [
	{
		title: "UT",
		desc: "Ultrasonic Testing",
		cover: "/images/ut.png",
		icon: Waves,
		fullName: "ULTRASONIC TESTING",
	},
	{
		title: "MPI",
		desc: "Magnetic Particle Inspection",
		cover: "/images/mpi.png",
		icon: Magnet,
		fullName: "MAGNETIC PARTICLE INSPECTION",
	},
	{
		title: "DPI",
		desc: "Dye Penetrant Inspection",
		cover: "/images/dpt.png",
		icon: Eye,
		fullName: "DYE PENETRANT INSPECTION",
	},
	{
		title: "RT/RFI",
		desc: "Radiographic Testing and Radiographic Film Interpretation",
		cover: "/images/rtfi.png",
		icon: Radio,
		fullName: "RADIOGRAPHIC TESTING",
	},
	{
		title: "VT/VE",
		desc: "Visual Testing or Examination",
		cover: "/images/vt.png",
		icon: Monitor,
		fullName: "VISUAL TESTING",
	},
	{
		title: "PMI",
		desc: "Positive Material Identification",
		cover: "/images/pmi.png",
		icon: TestTube,
		fullName: "POSITIVE MATERIAL IDENTIFICATION",
	},
	{
		title: "Hardness Testing",
		desc: "Material hardness verification",
		cover: "/images/mhv.png",
		icon: HardHat,
		fullName: "HARDNESS TESTING",
	},
	{
		title: "Sales of NDT Equipment",
		desc: "Professional NDT equipment sales",
		cover: "/images/sales.jpeg",
		icon: ShoppingCart,
		fullName: "NDT EQUIPMENT SALES",
	},
];

function ServicesPage() {
	return (
		<div className="min-h-screen bg-base-200 py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Page Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
						Our Services
					</h1>
					<p className="text-xl text-base-content/70 max-w-3xl mx-auto">
						Comprehensive Non-Destructive Testing solutions for industrial safety
						and quality assurance
					</p>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Video Player Section */}
					<div className="space-y-6">
						<VideoPlayer url="https://videos.pexels.com/video-files/3209176/3209176-uhd_2560_1440_25fps.mp4" />

						{/* Video Description */}
						<div className="bg-base-100 p-6">
							<h3 className="text-xl font-semibold text-base-content mb-3">
								About Our Services
							</h3>
							<p className="text-base-content/70 leading-relaxed">
								Discover how IDAN GLOBAL INTEGRATED LIMITED (IGIL)
								provides comprehensive Non-Destructive Testing
								solutions. Our expert team ensures safety, quality, and
								reliability across all industrial applications.
							</p>
						</div>
					</div>

					{/* Services List Section */}
					<div className="space-y-4">
						<h2 className="text-2xl font-bold text-base-content mb-6">
							Our Engineering Services
						</h2>

						<div className="space-y-4">
							{services.map((service, index) => {
								const IconComponent = service.icon;
								return (
									<div
										key={index}
										className="bg-base-100 p-6 transition-all duration-300 cursor-pointer group border border-base-300">
										<div className="flex items-center space-x-4">
											<div className="flex-shrink-0">
												<div className="w-12 h-12 bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
													<IconComponent className="w-6 h-6 text-primary" />
												</div>
											</div>
											<div className="flex-1">
												<h3 className="text-lg font-semibold">
													{
														service.fullName
													}
												</h3>
												<p className="text-sm text-base-content/60 mt-1">
													{service.desc}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Call to Action */}
				<div className="mt-16 text-center">
					<div className="bg-base-100">
						<h3 className="text-2xl font-bold text-base-content mb-4">
							Ready to Get Started?
						</h3>
						<p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
							Contact our team of experts to discuss your specific NDT
							requirements and discover how we can help ensure the safety and
							quality of your projects.
						</p>
						<Link className="btn btn-primary" href={"/contact-us"}>
							Contact Us Today
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServicesPage;
