"use client";

import { useState } from "react";

function ContactUsForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isLoading) return;
		setIsLoading(true);
		try {
			console.log("Form submitted:", formData);
			const request = await fetch("/api/email", {
				method: "POST",
				body: JSON.stringify(formData),
				headers: { "Content-Type": "application/json" },
			});
			const response = await request.json();

			if (request.status !== 200 && request.status !== 201) {
				throw new Error(response.message);
			}
			console.log(response);
			alert("Thank you for your message! We'll get back to you soon.");
			// setFormData({ name: "", email: "", phone: "", message: "" });
		} catch (error) {
			let message = "Something went wrong. Please, try again";
			if (error instanceof Error) {
				message = error.message;
			}

			alert(message);
		} finally {
			setIsLoading(false);
		}
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
									disabled={isLoading}
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
									disabled={isLoading}
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
									disabled={isLoading}
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
									disabled={isLoading}
									className="textarea w-full"
								/>
							</div>
							<button
								type="submit"
								disabled={isLoading}
								className="btn btn-primary btn-block">
								{isLoading ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-3 size-5"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24">
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Sending...
									</>
								) : (
									"Send Message"
								)}
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
								<p className="text-gray-700">info@igil.net</p>
							</div>
							<div>
								<h4 className="font-semibold text-gray-900">Phone</h4>

								<a
									href="tel:+2349034840287"
									className="block text-gray-700 hover:text-gray-900">
									+2349034840287
								</a>

								<a
									href="tel:+2349040034933"
									className="block text-gray-700 hover:text-gray-900">
									+2349040034933
								</a>

								<a
									href="tel:+2349034840287"
									className="block text-gray-700 hover:text-gray-900">
									+2349034840287
								</a>
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
