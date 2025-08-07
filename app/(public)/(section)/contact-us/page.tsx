import ContactUsForm from "@/app/components/contact-us";
import { Building2, Clock, Globe, Mail, MessageCircle, Phone, Send } from "lucide-react";

function ContactUsPage() {
	return (
		<div className="min-h-screen bg-base-100">
			{/* Hero Section */}
			<section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<div className="flex justify-center mb-6">
							<div className="bg-primary/20 p-4 rounded-full">
								<MessageCircle className="w-12 h-12 text-primary" />
							</div>
						</div>
						<h1 className="text-4xl md:text-6xl font-bold text-base-content mb-6">
							Get In Touch
						</h1>
						<p className="text-xl text-base-content/70 max-w-3xl mx-auto">
							Ready to discuss your NDT requirements? Our expert team is here
							to help you with all your inspection and testing needs.
						</p>
					</div>
				</div>
			</section>

			{/* Contact Form Section */}
			<ContactUsForm />

			{/* Additional Contact Information */}
			<section className="py-20 bg-base-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-base-content mb-6">
							Connect With Us
						</h2>
						<p className="text-lg text-base-content/70 max-w-3xl mx-auto">
							Multiple ways to reach our NDT experts and get the support you
							need.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{/* Email Contact */}
						<div className="bg-base-100 p-8 rounded-lg border border-base-300">
							<div className="flex items-center justify-center mb-4">
								<div className="bg-primary/20 p-3 rounded-full">
									<Mail className="w-8 h-8 text-primary" />
								</div>
							</div>
							<h3 className="text-xl font-semibold text-base-content text-center mb-2">
								Email Us
							</h3>
							<p className="text-base-content/70 text-center mb-4">
								Send us a detailed message about your requirements
							</p>
							<div className="text-center">
								<a
									href="mailto:info@igil.com"
									className="btn btn-primary btn-sm">
									<Mail className="w-4 h-4 mr-2" />
									info@igil.com
								</a>
							</div>
						</div>

						{/* Phone Contact */}
						<div className="bg-base-100 p-8 rounded-lg border border-base-300">
							<div className="flex items-center justify-center mb-4">
								<div className="bg-secondary/20 p-3 rounded-full">
									<Phone className="w-8 h-8 text-secondary" />
								</div>
							</div>
							<h3 className="text-xl font-semibold text-base-content text-center mb-2">
								Call Us
							</h3>
							<p className="text-base-content/70 text-center mb-4">
								Speak directly with our NDT specialists
							</p>
							<div className="text-center">
								<a
									href="tel:+2349034840287"
									className="btn btn-secondary btn-sm">
									<Phone className="w-4 h-4 mr-2" />
									+234 903 484 0287
								</a>
							</div>
						</div>

						{/* Business Hours */}
						<div className="bg-base-100 p-8 rounded-lg border border-base-300">
							<div className="flex items-center justify-center mb-4">
								<div className="bg-accent/20 p-3 rounded-full">
									<Clock className="w-8 h-8 text-accent" />
								</div>
							</div>
							<h3 className="text-xl font-semibold text-base-content text-center mb-2">
								Business Hours
							</h3>
							<div className="text-base-content/70 text-center space-y-2">
								<p className="text-sm">Monday - Friday</p>
								<p className="font-medium">8:00 AM - 6:00 PM</p>
								<p className="text-sm mt-4">Saturday</p>
								<p className="font-medium">9:00 AM - 3:00 PM</p>
							</div>
						</div>

						{/* Company Info */}
						<div className="bg-base-100 p-8 rounded-lg border border-base-300">
							<div className="flex items-center justify-center mb-4">
								<div className="bg-info/20 p-3 rounded-full">
									<Building2 className="w-8 h-8 text-info" />
								</div>
							</div>
							<h3 className="text-xl font-semibold text-base-content text-center mb-2">
								About IGIL
							</h3>
							<p className="text-base-content/70 text-center mb-4">
								Leading NDT services provider with years of expertise
							</p>
							<div className="text-center">
								<a href="/about-us" className="btn btn-info btn-sm">
									<Globe className="w-4 h-4 mr-2" />
									Learn More
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-20 bg-primary text-primary-content">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
					<p className="text-xl mb-8 opacity-90">
						Contact us today for a free consultation and quote on your NDT
						requirements.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="#contact" className="btn btn-secondary btn-lg">
							<Send className="w-5 h-5 mr-2" />
							Send Message
						</a>
						<a
							href="tel:+2349034840287"
							className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
							<Phone className="w-5 h-5 mr-2" />
							Call Now
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}

export default ContactUsPage;
