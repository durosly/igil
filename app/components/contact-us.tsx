"use client";

import { useState } from "react";

function ContactUsForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		alert("Thank you for your message! We'll get back to you soon.");
		setFormData({ name: "", email: "", phone: "", message: "" });
	};

	return (
		<section id="contact" className="py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
						Contact Us
					</h2>
					<p className="text-lg text-gray-700 max-w-3xl mx-auto">
						Ready to discuss your NDT requirements? Get in touch with our expert
						team today.
					</p>
				</div>
				<div className="grid md:grid-cols-2 gap-12">
					<div>
						<form onSubmit={handleFormSubmit} className="space-y-6">
							<div className="fieldset">
								<label htmlFor="name" className="label">
									Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleFormChange}
									required
									className="input w-full"
								/>
							</div>
							<div className="fieldset">
								<label htmlFor="email" className="label">
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleFormChange}
									required
									className="input w-full"
								/>
							</div>
							<div className="fieldset">
								<label htmlFor="phone" className="label">
									Phone (optional)
								</label>
								<input
									type="tel"
									id="phone"
									name="phone"
									value={formData.phone}
									onChange={handleFormChange}
									className="input w-full"
								/>
							</div>
							<div className="fieldset">
								<label htmlFor="message" className="label">
									Message
								</label>
								<textarea
									id="message"
									name="message"
									rows={4}
									value={formData.message}
									onChange={handleFormChange}
									required
									className="textarea w-full"
								/>
							</div>
							<button type="submit" className="cta-button w-full">
								Send Message
							</button>
						</form>
					</div>
					<div className="bg-base-200 p-8">
						<h3 className="text-2xl font-semibold text-gray-900 mb-6">
							Company Details
						</h3>
						<div className="space-y-4">
							{/* <div>
								<h4 className="font-semibold text-gray-900">Address</h4>
								<p className="text-gray-700">[Your Company Address]</p>
							</div> */}
							<div>
								<h4 className="font-semibold text-gray-900">Email</h4>
								<p className="text-gray-700">info@igil.com</p>
							</div>
							<div>
								<h4 className="font-semibold text-gray-900">Phone</h4>
								<p className="text-gray-700">+2349034840287</p>
							</div>
							<div>
								<h4 className="font-semibold text-gray-900">
									Business Hours
								</h4>
								<p className="text-gray-700">
									Monday - Friday: 8:00 AM - 6:00 PM
								</p>
								<p className="text-gray-700">
									Saturday: 9:00 AM - 3:00 PM
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ContactUsForm;
