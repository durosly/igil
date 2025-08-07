import {
	Award,
	Building2,
	Globe,
	Heart,
	Lightbulb,
	Mail,
	MapPin,
	Phone,
	Shield,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About Us",
	description:
		"Learn about IDAN GLOBAL INSPECTION LIMITED (IGIL) - a leading NDT services provider in Nigeria since 2010. ISO 9712 and ASNT Level II certified professionals with 8+ years of experience in industrial safety and quality assurance.",
	keywords: [
		"About IDAN GLOBAL INSPECTION LIMITED",
		"IGIL company",
		"NDT company Nigeria",
		"Industrial inspection company",
		"ISO 9712 certified company",
		"ASNT Level II certified",
		"Non-Destructive Testing company",
		"Quality assurance company",
		"Industrial safety services",
		"IDOGHOR ANTHONY URUEMU",
	],
	openGraph: {
		title: "About Us - IDAN GLOBAL INSPECTION LIMITED",
		description:
			"Learn about IDAN GLOBAL INSPECTION LIMITED (IGIL) - a leading NDT services provider in Nigeria since 2010. ISO 9712 and ASNT Level II certified professionals.",
		url: "https://igil.net/about-us",
		siteName: "IDAN GLOBAL INSPECTION LIMITED",
		images: [
			{
				url: "/images/cover.png",
				width: 1200,
				height: 630,
				alt: "About IDAN GLOBAL INSPECTION LIMITED",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "About Us - IDAN GLOBAL INSPECTION LIMITED",
		description:
			"Learn about IDAN GLOBAL INSPECTION LIMITED (IGIL) - a leading NDT services provider in Nigeria since 2010.",
		images: ["/images/cover.png"],
	},
	alternates: {
		canonical: "https://igil.net/about-us",
	},
};

function AboutUsPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-4xl mx-auto">
						<h1 className="text-5xl font-bold mb-6">About IDAN</h1>
						<p className="text-xl opacity-90 mb-8">
							Empowering businesses through innovative solutions and
							unwavering commitment to excellence
						</p>
						<div className="flex justify-center">
							<div className="bg-base-100 border border-base-300  p-8">
								<Building2 className="w-16 h-16 mx-auto mb-4" />
								<p className="text-lg font-medium">Established 2010</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-2 gap-12">
						{/* Mission */}
						<div className="p-6 bg-base-100">
							<div className="text-center">
								<Target className="w-16 h-16 text-primary mx-auto mb-6" />
								<h2 className="text-3xl font-bold mb-4">Our Mission</h2>
								<p className="text-gray-600 leading-relaxed">
									To deliver cutting-edge solutions that transform
									businesses and create lasting value for our
									clients, while maintaining the highest standards
									of quality and innovation in everything we do.
								</p>
							</div>
						</div>

						{/* Vision */}
						<div className="p-6 bg-base-100">
							<div className="text-center">
								<Globe className="w-16 h-16 text-secondary mx-auto mb-6" />
								<h2 className="text-3xl font-bold mb-4">Our Vision</h2>
								<p className="text-gray-600 leading-relaxed">
									To be the leading partner for businesses seeking
									digital transformation, recognized globally for
									our innovative approach and exceptional results.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values */}
			<section className="py-20 bg-base-100">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
						<p className="text-gray-600 text-lg">
							The principles that guide everything we do
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center">
							<div className="bg-primary/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
								<Heart className="w-10 h-10 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Passion</h3>
							<p className="text-gray-600">
								We approach every project with enthusiasm and dedication
							</p>
						</div>

						<div className="text-center">
							<div className="bg-secondary/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
								<Shield className="w-10 h-10 text-secondary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Integrity</h3>
							<p className="text-gray-600">
								Honest, transparent, and ethical in all our dealings
							</p>
						</div>

						<div className="text-center">
							<div className="bg-accent/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
								<Lightbulb className="w-10 h-10 text-accent" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Innovation</h3>
							<p className="text-gray-600">
								Constantly pushing boundaries and exploring new
								solutions
							</p>
						</div>

						<div className="text-center">
							<div className="bg-info/10 w-20 h-20 flex items-center justify-center mx-auto mb-4">
								<Users className="w-10 h-10 text-info" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Collaboration</h3>
							<p className="text-gray-600">
								Working together to achieve exceptional results
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-4 gap-8 text-center">
						<div>
							<TrendingUp className="w-12 h-12 mx-auto mb-4" />
							<div className="text-4xl font-bold mb-2">10+</div>
							<p className="opacity-90">Projects Completed</p>
						</div>
						<div>
							<Users className="w-12 h-12 mx-auto mb-4" />
							<div className="text-4xl font-bold mb-2">50+</div>
							<p className="opacity-90">Team Members</p>
						</div>
						<div>
							<Award className="w-12 h-12 mx-auto mb-4" />
							<div className="text-4xl font-bold mb-2">8+</div>
							<p className="opacity-90">Years Experience</p>
						</div>
						<div>
							<Globe className="w-12 h-12 mx-auto mb-4" />
							<div className="text-4xl font-bold mb-2">2+</div>
							<p className="opacity-90">Countries Served</p>
						</div>
					</div>
				</div>
			</section>

			{/* Team */}
			<section className="py-20 bg-base-100">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">Our Leadership Team</h2>
						<p className="text-gray-600 text-lg">
							Meet the visionaries behind IDAN&apos;s success
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="p-6 border border-base-300 text-center">
							<div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/70 mx-auto mb-6 flex items-center justify-center">
								<Users className="w-16 h-16 text-white" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
							<p className="text-primary font-medium mb-2">CEO & Founder</p>
							<p className="text-gray-600">
								15+ years of experience in digital transformation
							</p>
						</div>

						<div className="p-6 border border-base-300 text-center">
							<div className="w-32 h-32 bg-gradient-to-br from-secondary to-secondary/70 mx-auto mb-6 flex items-center justify-center">
								<Target className="w-16 h-16 text-white" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
							<p className="text-secondary font-medium mb-2">CTO</p>
							<p className="text-gray-600">
								Expert in emerging technologies and innovation
							</p>
						</div>

						<div className="p-6 border border-base-300 text-center">
							<div className="w-32 h-32 bg-gradient-to-br from-accent to-accent/70 mx-auto mb-6 flex items-center justify-center">
								<Award className="w-16 h-16 text-white" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Emily Rodriguez</h3>
							<p className="text-accent font-medium mb-2">
								Head of Operations
							</p>
							<p className="text-gray-600">
								Ensuring excellence in every project delivery
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Info */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
						<p className="text-gray-600 text-lg">
							Ready to start your next project with IDAN?
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="p-6 bg-base-100 text-center">
							<MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">Visit Us</h3>
							<p className="text-gray-600">
								123 Innovation Drive
								<br />
								Tech City, TC 12345
							</p>
						</div>

						<div className="p-6 bg-base-100 text-center">
							<Phone className="w-12 h-12 text-secondary mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">Call Us</h3>
							<p className="text-gray-600">
								+1 (555) 123-4567
								<br />
								Mon-Fri 9AM-6PM
							</p>
						</div>

						<div className="p-6 bg-base-100 text-center">
							<Mail className="w-12 h-12 text-accent mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">Email Us</h3>
							<p className="text-gray-600">
								hello@idan.com
								<br />
								We&apos;ll respond within 24 hours
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default AboutUsPage;
