import {
	CheckCircle,
	ClipboardList,
	Cpu,
	HardHat,
	Heart,
	Leaf,
	Lightbulb,
	PiggyBank,
	Settings,
	Shield,
	Target,
	Users,
} from "lucide-react";
import Image from "next/image";
import ContactUsForm from "../components/contact-us";
import HeroSlider from "../components/hero-slider";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Home",
	description:
		"IDAN GLOBAL INSPECTION LIMITED (IGIL) - Your trusted partner for comprehensive Non-Destructive Testing (NDT) services in Nigeria. ISO 9712 and ASNT Level II certified professionals ensuring safety, quality, and reliability across all industries.",
	keywords: [
		"NDT services Nigeria",
		"Non-Destructive Testing",
		"Industrial inspection",
		"Quality assurance",
		"Safety testing",
		"ISO 9712 certified",
		"ASNT Level II",
		"Ultrasonic Testing",
		"Magnetic Particle Inspection",
		"Radiographic Testing",
	],
	openGraph: {
		title: "IDAN GLOBAL INSPECTION LIMITED (IGIL) - Leading NDT Services in Nigeria",
		description:
			"Your trusted partner for comprehensive Non-Destructive Testing (NDT) services in Nigeria. ISO 9712 and ASNT Level II certified professionals.",
		url: "https://igil.net",
		siteName: "IDAN GLOBAL INSPECTION LIMITED",
		images: [
			{
				url: "/images/logo.png",
				width: 1200,
				height: 630,
				alt: "IDAN GLOBAL INSPECTION LIMITED - NDT Services",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "IDAN GLOBAL INSPECTION LIMITED (IGIL) - Leading NDT Services in Nigeria",
		description:
			"Your trusted partner for comprehensive Non-Destructive Testing (NDT) services in Nigeria.",
		images: ["/images/logo.png"],
	},
	alternates: {
		canonical: "https://igil.net",
	},
};

const services = [
	{
		title: "UT",
		desc: "Ultrasonic Testing",
		cover: "/images/ut.png",
		sizes: "(min-width: 1400px) 286px, (min-width: 1040px) calc(13.53vw + 99px), (min-width: 780px) calc(50vw - 36px), calc(96.52vw - 22px)",
	},
	{
		title: "MPI",
		desc: "Magnetic Particle Inspection",
		cover: "/images/mpi.png",
		sizes: "(min-width: 1400px) 286px, (min-width: 1040px) calc(13.53vw + 99px), (min-width: 780px) calc(50vw - 36px), calc(96.52vw - 22px)",
	},
	{
		title: "DPI",
		desc: "Dye Penetrant Inspection",
		cover: "/images/dpt.png",
		sizes: "(min-width: 1400px) 286px, (min-width: 1040px) calc(13.53vw + 99px), (min-width: 780px) calc(50vw - 36px), calc(96.52vw - 22px)",
	},
	{
		title: "RT/RFI",
		desc: "Radiographic Testing and Radiographic Film Interpretation",
		cover: "/images/rtfi.png",
		sizes: "(min-width: 1040px) 277px, (min-width: 780px) calc(50vw - 36px), 93.48vw",
	},
	{
		title: "VT/VE",
		desc: "Visual Testing or Examination",
		cover: "/images/vt.png",
		sizes: "(min-width: 1400px) 286px, (min-width: 1040px) calc(12.94vw + 107px), (min-width: 780px) calc(50vw - 36px), calc(96.52vw - 22px)",
	},
	{
		title: "PMI",
		desc: "Positive Material Identification",
		cover: "/images/pmi.png",
		sizes: "(min-width: 1400px) 286px, (min-width: 1040px) calc(13.24vw + 103px), (min-width: 780px) calc(50vw - 36px), calc(96.52vw - 22px)",
	},
	{
		title: "Hardness Testing",
		desc: "Material hardness verification",
		cover: "/images/mhv.png",
		sizes: "(min-width: 1380px) 286px, (min-width: 1040px) calc(15.31vw + 78px), (min-width: 780px) calc(50vw - 36px), calc(96.52vw - 22px)",
	},
	{
		title: "Sales of NDT Equipment",
		desc: "Professional NDT equipment sales",
		cover: "/images/sales.jpeg",
		sizes: "(min-width: 1360px) 286px, (min-width: 1040px) calc(20vw + 18px), (min-width: 780px) calc(50vw - 36px), calc(96.52vw - 22px)",
	},
];

const values = [
	{
		icon: Heart,
		title: "Integrity",
		description:
			"We conduct our business with honesty, transparency, and ethical practices, building trust with our clients and partners.",
		primary: true,
	},
	{
		icon: Shield,
		title: "Quality Excellence",
		description:
			"We strive for excellence in every aspect of our work, maintaining the highest standards of quality and professionalism.",
		primary: false,
	},
	{
		icon: Users,
		title: "Customer Focus",
		description:
			"We prioritize our customers' success by understanding their needs and providing tailored solutions that drive results.",
		primary: false,
	},
	{
		icon: Lightbulb,
		title: "Innovation",
		description:
			"We embrace new technologies and methodologies to provide cutting-edge solutions that meet evolving industry needs.",
		primary: false,
	},
	{
		icon: Target,
		title: "Results Driven",
		description:
			"We are committed to achieving measurable outcomes and delivering value through strategic execution and accountability.",
		primary: false,
	},
	{
		icon: Leaf,
		title: "Safety",
		description:
			"Safety is our top priority. We ensure the well-being of our team, clients, and the environment in all our operations.",
		primary: false,
	},
];

export default function Home() {
	return (
		<main className="min-h-screen">
			<HeroSlider />

			{/* Home Section */}
			<section id="home" className="py-20 bg-gradient-to-br from-red-50 to-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Ensuring Safety, Quality, and Reliability in Non-Destructive Testing
					</h1>
					<p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-700">
						IDAN GLOBAL INSPECTION LIMITED (IGIL) — Your Trusted Partner in Reliable
						NDT Solutions
					</p>
					<div className="mb-8 space-y-2">
						<p>
							At IDAN GLOBAL INSPECTION LIMITED (IGIL), we take pride in being
							a trusted leader in Non-Destructive Testing services. Our
							culture and business model offer clients the best of both
							worlds: the dedicated, hands-on service of a specialized firm
							combined with the advanced technological capabilities and
							expertise of a large inspection company.
						</p>
						<p>
							From routine equipment checks to large-scale industrial
							projects, our team has the skills, certifications, and
							innovative solutions to scale and integrate our services
							seamlessly — ensuring every project is delivered with precision,
							reliability, and a personal touch.
						</p>
					</div>
					<Link href="/contact-us" className="btn btn-primary">
						Get in Touch
					</Link>
				</div>
			</section>

			{/* Solution that inspires */}
			<section className="py-20 bg-gray-900 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-3 gap-12">
						{/* Left Section */}
						<div className="lg:col-span-1">
							<div className="mb-6">
								<span className="text-secondary text-sm font-medium">
									WHAT WE DO &gt;
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
								Solution that inspire progress
							</h2>
						</div>

						{/* Right Section */}
						<div className="lg:col-span-2">
							<div className="grid md:grid-cols-2 gap-8">
								{/* Skilled Team */}
								<div className="flex items-start space-x-4">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 bg-secondary flex items-center justify-center">
											<Users className="w-6 h-6 text-white" />
										</div>
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">
											Skilled Team
										</h3>
										<p className="text-gray-300 text-sm leading-relaxed">
											We are experts at work with very
											nice planning for next project.
										</p>
									</div>
								</div>

								{/* Core Planning */}
								<div className="flex items-start space-x-4">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 bg-secondary flex items-center justify-center">
											<ClipboardList className="w-6 h-6 text-white" />
										</div>
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">
											Core Planning
										</h3>
										<p className="text-gray-300 text-sm leading-relaxed">
											Strategic planning that ensures
											optimal distribution of
											resources and efficient project
											execution.
										</p>
									</div>
								</div>

								{/* Save Money */}
								<div className="flex items-start space-x-4">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 bg-secondary flex items-center justify-center">
											<PiggyBank className="w-6 h-6 text-white" />
										</div>
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">
											Save Money
										</h3>
										<p className="text-gray-300 text-sm leading-relaxed">
											Cost-effective solutions that
											help you save money while
											maintaining the highest quality
											standards.
										</p>
									</div>
								</div>

								{/* Technology */}
								<div className="flex items-start space-x-4">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 bg-secondary flex items-center justify-center">
											<Cpu className="w-6 h-6 text-white" />
										</div>
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">
											Technology
										</h3>
										<p className="text-gray-300 text-sm leading-relaxed">
											Cutting-edge technology and
											advanced equipment for precise
											and reliable testing results.
										</p>
									</div>
								</div>

								{/* Project Result */}
								<div className="flex items-start space-x-4 md:col-span-2">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 bg-secondary flex items-center justify-center">
											<Target className="w-6 h-6 text-white" />
										</div>
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">
											Project Result
										</h3>
										<p className="text-gray-300 text-sm leading-relaxed">
											Delivering exceptional project
											results that exceed expectations
											and drive success for our
											clients.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* About Us Section */}
			<section className="py-20 bg-white relative overflow-hidden">
				{/* Background Gears */}
				<div className="absolute -top-8 -left-8 opacity-10 pointer-none">
					<Settings className="size-40 " />
				</div>
				<div className="absolute -bottom-6 -right-8 opacity-10">
					<HardHat className="size-36" />
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Side - Visual & Experience */}
						<div className="relative">
							{/* Main Image Container */}
							<div className="relative">
								{/* Yellow Experience Bar */}
								<div className="absolute left-0 top-0 bottom-0 w-4 bg-secondary flex items-center justify-center">
									<div className="transform -rotate-90 whitespace-nowrap text-white font-semibold text-sm">
										8+ Years of Experience
									</div>
								</div>

								{/* Main Image */}
								<div className="ml-4 relative">
									<div className="w-full h-96 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
										{/* Dummy Image Placeholder */}
										<Image
											src={"/images/aim.jpeg"}
											alt=""
											fill
											className="object-cover"
											sizes="(min-width: 1360px) 568px, (min-width: 1040px) calc(40vw + 32px), (min-width: 540px) calc(96.67vw - 30px), calc(12.27vw + 408px)"
										/>
										<div className="absolute inset-0 bg-gradient-to-br from-black/90 to-gray-700/20 flex items-center justify-center">
											<div className="text-center text-white">
												<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
													<Users className="w-8 h-8" />
												</div>
												<p className="text-lg font-semibold">
													Industrial
													Workers
												</p>
												<p className="text-sm opacity-80">
													Professional
													team at work
												</p>
											</div>
										</div>
									</div>

									{/* Video Thumbnail */}
									<div className="absolute -bottom-8 -right-6 w-52 h-40 bg-secondary border-4 border-white">
										<Image
											src={"/images/m-spray.jpeg"}
											alt=""
											fill
											className="object-cover"
											sizes="202px"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Mission & Vision Section */}
						<div className="space-y-8">
							{/* Section Header */}
							<div>
								<div className="flex items-center mb-2">
									<div className="w-8 h-0.5 bg-secondary"></div>
									<span className="text-secondary text-sm font-medium ml-2">
										ABOUT IGIL INDUSTRY
									</span>
								</div>
								<h2 className="text-4xl md:text-5xl font-bold text-gray-900">
									Our Company Mission
								</h2>
							</div>

							{/* Mission Text */}
							<div className="space-y-4 text-gray-700 leading-relaxed">
								<p>
									To provide world-class non-destructive testing
									services that ensure safety, quality, and
									reliability across all industries. We are
									committed to delivering accurate, timely, and
									cost-effective solutions that meet international
									standards and exceed client expectations.
								</p>
								<div>
									<h2 className="font-bold">Vision:</h2>
									<p>
										To be the leading provider of NDT
										services in Nigeria and beyond,
										recognized for our technical excellence,
										innovation, and commitment to safety. We
										aspire to set industry standards and
										contribute to the advancement of
										non-destructive testing technology.
									</p>
								</div>
							</div>

							{/* Key Highlights */}
							<div className="grid md:grid-cols-2 gap-6">
								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0">
										<CheckCircle className="w-5 h-5 text-secondary mt-1" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-2">
											Proven Expertise
										</h3>
										<p className="text-sm text-gray-600">
											Delivering accurate and reliable
											NDT solutions trusted by top
											industries. Our track record
											speaks for itself — trusted by
											leading industries across the
											region.
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0">
										<CheckCircle className="w-5 h-5 text-secondary mt-1" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-2">
											Skilled Professionals
										</h3>
										<p className="text-sm text-gray-600">
											Certified experts using advanced
											technology to ensure quality and
											safety. We combine advanced
											technology with human expertise
											to provide solutions tailored to
											your needs.
										</p>
									</div>
								</div>
							</div>

							{/* Signature Block */}
							<div className="flex items-center space-x-4 pt-4">
								<div>
									<p className="font-semibold capitalize text-gray-900">
										IDOGHOR ANTHONY URUEMU
									</p>
									<p className="text-sm text-gray-600">
										CEO & Founder
									</p>
								</div>
								{/* <div className="w-24 h-12 relative flex items-center justify-center">
									<Image
										src={"/images/signature.png"}
										fill
										alt=""
										className="object-contain"
									/>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-16 px-4">
				<div className="max-w-7xl mx-auto relative">
					{/* Header */}
					<div className="text-left mb-12">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-12 h-0.5 bg-secondary"></div>
							<span className="text-secondary font-semibold tracking-wider uppercase text-sm">
								CORE PRINCIPLES
							</span>
						</div>
						<h2 className="text-4xl font-bold text-base-content">Our Values</h2>
					</div>

					{/* Values Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{values.map((value, index) => {
							const IconComponent = value.icon;

							return (
								<div
									key={index}
									className={`group relative bg-base-300 text-base-content
									`}>
									{/* Icon container */}
									<div
										className={`size-20 flex items-center justify-center -mt-5 ml-5 border-4 border-base-100 bg-secondary`}>
										<IconComponent
											size={28}
											className={
												"flex-shrink-0 text-secondary-content"
											}
										/>
									</div>

									{/* Content */}
									<div className="p-6">
										<h3 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors duration-300">
											{value.title}
										</h3>
										<p
											className={`text-sm leading-relaxed text-base-content/70`}>
											{value.description}
										</p>
									</div>

									{/* Decorative corner accent */}
									<div className="absolute bottom-0 right-0 w-16 h-16 opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
										<div className="absolute bottom-2 right-2 w-8 h-0.5 bg-secondary transform rotate-45"></div>
										<div className="absolute bottom-2 right-2 w-0.5 h-8 bg-secondary transform rotate-45"></div>
									</div>

									{/* Hover effect overlay */}
									<div className="absolute inset-0 bg-gradient-to-br from-transparent to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Aim Section */}
			<section id="aim" className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-10">
						<div className="relative h-96 lg:h-full">
							<Image
								src={
									"https://images.unsplash.com/photo-1610259998914-d1b9afe0dc55"
								}
								// src="/images/m-spray-2.jpeg"
								alt=""
								fill
								className="object-cover"
								sizes="(min-width: 1720px) 1219px, (min-width: 1040px) calc(-11.21vw + 1408px), (min-width: 660px) calc(100vw - 48px), 562px"
							/>
						</div>
						<div>
							<div className="text-left mb-8">
								<div className="flex items-center gap-2 mb-4">
									<div className="w-12 h-0.5 bg-primary"></div>
									<span className="text-primary font-semibold tracking-wider uppercase text-sm">
										CORE PRINCIPLES
									</span>
								</div>
								<h2 className="text-4xl font-bold text-base-content">
									Our Aim
								</h2>
							</div>
							<p className="text-lg text-gray-700 max-w-3xl mx-auto">
								Four fundamental objectives that drive our commitment to
								excellence.
							</p>

							<div className="grid gap-8 mt-10">
								<div className="aim-card bg-base-200 p-5">
									<div className="flex items-center mb-3">
										<Shield className="w-6 h-6 text-primary mr-3" />
										<h3 className="text-xl font-semibold">
											Ensuring Safety
										</h3>
									</div>
									<p className="text-gray-700">
										To identify potential hazards and
										defects that could compromise the safety
										of structures, equipment, and personnel.
									</p>
								</div>
								<div className="aim-card bg-base-200 p-5">
									<div className="flex items-center mb-3">
										<Settings className="w-6 h-6 text-primary mr-3" />
										<h3 className="text-xl font-semibold">
											Improving Reliability
										</h3>
									</div>
									<p className="text-gray-700">
										To enhance the reliability and
										performance of materials and components
										through comprehensive testing and
										analysis.
									</p>
								</div>
								<div className="aim-card bg-base-200 p-5">
									<div className="flex items-center mb-3">
										<CheckCircle className="w-6 h-6 text-primary mr-3" />
										<h3 className="text-xl font-semibold">
											Ensuring Quality Control
										</h3>
									</div>
									<p className="text-gray-700">
										To maintain strict quality control
										standards that meet or exceed industry
										requirements and client specifications.
									</p>
								</div>
								<div className="aim-card bg-base-200 p-5">
									<div className="flex items-center mb-3">
										<ClipboardList className="w-6 h-6 text-primary mr-3" />
										<h3 className="text-xl font-semibold">
											Compliance with Standards
										</h3>
									</div>
									<p className="text-gray-700">
										To ensure all testing procedures and
										results comply with international
										standards and regulatory requirements.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* About NDT Section */}
			<section id="about-ndt" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-16">
						<div className="text-left mb-8">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-12 h-0.5 bg-primary"></div>
								<span className="text-primary font-semibold tracking-wider uppercase text-sm">
									UNDERSTANDING NDT
								</span>
							</div>
							<h2 className="text-4xl font-bold text-base-content">
								About NDT
							</h2>
						</div>
						{/* <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
							About NDT
						</h2> */}
						<p className="text-gray-700 leading-relaxed mb-6">
							Non-Destructive Testing (NDT) is a wide group of analysis
							techniques used in science and technology industry to evaluate
							the properties of a material, component or system without
							causing damage.
						</p>
						<p className="text-gray-700 leading-relaxed">
							NDT methods are used to detect, characterize, or measure the
							presence of damage mechanisms (e.g. corrosion or cracks), verify
							the condition of a material, or measure geometrical properties.
							The terms Nondestructive Examination (NDE), Nondestructive
							Inspection (NDI), and Nondestructive Evaluation (NDE) are also
							commonly used to describe this technology.
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="bg-base-100 p-8 content mx-10 order-2 md:order-1">
							<h3 className="text-2xl font-bold text-primary mb-4">
								Why Choose NDT?
							</h3>
							<ul className="text-gray-700 space-y-2">
								<li className="flex items-center gap-2">
									<CheckCircle className="size-5 text-primary flex-shrink-0" />
									Prevents catastrophic failures
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle className="size-5 text-primary flex-shrink-0" />
									Reduces maintenance costs
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle className="size-5 text-primary flex-shrink-0" />
									Ensures regulatory compliance
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle className="size-5 text-primary flex-shrink-0" />
									Extends equipment lifespan
								</li>
								<li className="flex items-center gap-2">
									<CheckCircle className="size-5 text-primary flex-shrink-0" />
									Improves safety standards
								</li>
							</ul>
						</div>
						<div className="relative h-80 order-1 md:order-2 border-8 border-base-100">
							<Image
								src="/images/ndt.jpeg"
								alt=""
								fill
								className="object-cover"
								sizes="(min-width: 1360px) 568px, (min-width: 780px) 43.21vw, calc(96.09vw - 34px)"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section id="services" className="py-20" itemScope itemType="https://schema.org/Service">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2
							className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
							itemProp="name">
							NDT Services
						</h2>
						<p
							className="text-lg text-gray-700 max-w-3xl mx-auto"
							itemProp="description">
							Comprehensive non-destructive testing solutions to ensure the
							integrity and quality of your materials and structures.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{services.map((service, index) => (
							<article
								className="bg-base-300"
								key={index}
								itemScope
								itemType="https://schema.org/Service">
								<div className="relative w-full h-40">
									<Image
										src={service.cover}
										alt={service.title}
										fill
										className="object-cover"
										sizes={service.sizes}
										itemProp="image"
									/>
								</div>
								<div className="p-5">
									<h3
										className="text-xl font-bold"
										itemProp="name">
										{service.title}
									</h3>
									<p itemProp="description">{service.desc}</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* Advanced Services Section */}
			<section id="advanced-services" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
							Advanced NDT Services
						</h2>
						<p className="text-lg text-gray-700 max-w-3xl mx-auto">
							State-of-the-art advanced testing methods for complex inspection
							requirements.
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="advanced-service-card content content-close p-5">
							<h3 className="text-2xl font-semibold text-primary mb-3">
								PAUT
							</h3>
							<p className="text-gray-700">Phase Array Ultrasonic Testing</p>
						</div>
						<div className="advanced-service-card content content-close p-5">
							<h3 className="text-2xl font-semibold text-primary mb-3">
								TOFD
							</h3>
							<p className="text-gray-700">Time of Flight Diffraction</p>
						</div>
						<div className="advanced-service-card content content-close p-5">
							<h3 className="text-2xl font-semibold text-primary mb-3">ET</h3>
							<p className="text-gray-700">Eddy Current Testing</p>
						</div>
					</div>
				</div>
			</section>

			{/* Certifications Section */}
			<section id="certifications" className="py-20">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
						Certifications
					</h2>
					<div className="bg-base-200 rounded-lg px-5 py-12 md:p-12 max-w-4xl mx-auto">
						<p className="text-xl text-gray-700 mb-6">
							We are equipped with personnel certified in ISO 9712 and ASNT
							LEVEL II across all NDT methods.
						</p>
						<div className="grid md:grid-cols-2 gap-8 mt-8">
							<div className="certification-item">
								<div className="relative size-16 mx-auto">
									<Image
										src="/images/iso-logo.png"
										fill
										alt="ISO 9712 certificate"
										className="object-contain"
										sizes="64px"
									/>
								</div>
								<h3 className="text-2xl font-semibold mb-3">
									ISO 9712
								</h3>
								<p className="text-gray-700">
									International standard for qualification and
									certification of NDT personnel, ensuring
									competence and reliability.
								</p>
							</div>
							<div className="certification-item">
								<div className="relative size-16 mx-auto">
									<Image
										src="/images/asnt-logo.png"
										fill
										alt="ASNT LEVEL II certificate"
										className="object-contain"
										sizes="63px"
									/>
								</div>
								<h3 className="text-2xl font-semibold mb-3">
									ASNT LEVEL II
								</h3>
								<p className="text-gray-700">
									American Society for Nondestructive Testing
									Level II certification, demonstrating advanced
									technical expertise.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Completed Jobs Section */}
			<section id="completed-jobs" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
							Completed Jobs
						</h2>
						<p className="text-lg text-gray-700 max-w-3xl mx-auto">
							Our track record of successful projects demonstrates our
							expertise and reliability across various industries.
						</p>
					</div>
					<div className="space-y-6 max-w-md mx-auto">
						<div className="job-card">
							<div className="flex items-start">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
										1
									</div>
								</div>
								<div className="ml-4">
									<p className="text-lg text-gray-700">
										Ultrasonic testing on columns of line A
										and B preheated at Dangote Cement
										Factory Limited, Itori.
									</p>
								</div>
							</div>
						</div>
						<div className="job-card">
							<div className="flex items-start">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
										2
									</div>
								</div>
								<div className="ml-4">
									<p className="text-lg text-gray-700">
										MPI and Ultrasonic Testing on line 5
										Mine 1,2,3 & 4 Crushers and pontoon.
									</p>
								</div>
							</div>
						</div>
						<div className="job-card">
							<div className="flex items-start">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
										3
									</div>
								</div>
								<div className="ml-4">
									<p className="text-lg text-gray-700">
										Ultrasonic flaws detection on welds on
										Queen Vivian Monrovia IMO 9331763
										Vessel.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<ContactUsForm />
		</main>
	);
}
