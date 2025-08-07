import type { ReactNode } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import Link from "next/link";

function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<div className="drawer">
			<input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				{/* Sticky Header */}
				<header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2">
					<div className="container mx-auto px-4">
						<div className="flex items-center justify-between h-16">
							{/* Logo Section */}
							<div className="flex gap-2 items-center justify-center">
								<div className="flex items-center space-x-3">
									{/* Igil Logo */}
									<Image
										src="/images/logo.png"
										alt="Igil Engineers Logo"
										width={120}
										height={40}
										className="h-14 w-auto"
									/>
								</div>

								<h1 className="">
									<span className="block text-5xl font-bold">
										IGIL
									</span>
									<span className="text-xl leading-0">
										Engineers
									</span>
								</h1>
							</div>

							{/* Desktop Navigation */}
							<nav className="hidden lg:flex items-center space-x-8">
								<Link
									href="/services"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Services
								</Link>
								<a
									href="#"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Industries
								</a>
								<a
									href="#"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Work
								</a>
								<a
									href="#"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Locations
								</a>
								<a
									href="#"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Igil Advantage
								</a>
								<a
									href="#"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Careers
								</a>
							</nav>

							{/* Right Icons */}
							<div className="flex items-center space-x-4">
								{/* Contact Icon */}
								<button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</button>
								{/* Search Icon */}
								<button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</button>
								{/* Mobile Menu Button */}
								<div className="lg:hidden">
									<label
										htmlFor="my-drawer-3"
										aria-label="open sidebar"
										className="btn btn-square btn-ghost">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											className="inline-block h-6 w-6 stroke-current">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M4 6h16M4 12h16M4 18h16"></path>
										</svg>
									</label>
								</div>
							</div>
						</div>
					</div>
				</header>

				{/* Page content here */}
				{children}
				{/* Footer */}
				<footer className="bg-gray-900 text-white py-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid md:grid-cols-4 gap-8">
							<div>
								<div className="text-2xl font-bold mb-4 text-primary">
									IGIL
								</div>
								<div className="text-sm text-gray-400 mb-4">
									IDAN GLOBAL INSPECTION LIMITED
								</div>
								<p className="text-gray-400 mb-4">
									Your trusted partner in reliable NDT solutions,
									ensuring safety, quality, and reliability across
									all industries.
								</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4">
									Quick Links
								</h3>
								<ul className="space-y-2">
									<li>
										<button className="footer-link">
											Services
										</button>
									</li>
									<li>
										<button className="footer-link">
											About NDT
										</button>
									</li>
									<li>
										<button className="footer-link">
											Certifications
										</button>
									</li>
									<li>
										<button className="footer-link">
											Completed Jobs
										</button>
									</li>
								</ul>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4">Services</h3>
								<ul className="space-y-2">
									<li className="text-gray-400">
										Ultrasonic Testing (UT)
									</li>
									<li className="text-gray-400">
										Magnetic Particle Inspection (MPI)
									</li>
									<li className="text-gray-400">
										Dye Penetrant Inspection (DPI)
									</li>
									<li className="text-gray-400">
										Radiographic Testing (RT)
									</li>
									<li className="text-gray-400">
										Visual Testing (VT)
									</li>
								</ul>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4">
									Contact Info
								</h3>
								<div className="space-y-2 text-gray-400">
									<p>Email: info@igil.com</p>
									<p>Phone: +234 [Your Phone]</p>
									<p>Address: [Your Address]</p>
								</div>
							</div>
						</div>

						<div className="border-t border-gray-800 mt-12 pt-8 text-center">
							<div className="text-gray-400 text-sm">
								©2025 IGIL - IDAN GLOBAL INSPECTION LIMITED. All rights
								reserved.
							</div>
						</div>
					</div>
				</footer>
			</div>
			<div className="drawer-side z-50">
				<label
					htmlFor="my-drawer-3"
					aria-label="close sidebar"
					className="drawer-overlay"></label>
				<div className="bg-base-200 min-h-full w-80 p-4">
					<label
						htmlFor="my-drawer-3"
						aria-label="close sidebar"
						className="btn btn-sm btn-square btn-ghost absolute top-2 right-2">
						<XIcon className="size-5" />
					</label>
					<div className="relative size-10 mx-auto">
						<Image
							src="/images/logo.png"
							fill
							alt="IDAN"
							className="object-contain"
						/>
					</div>
					<ul className="menu ">
						{/* Sidebar content here */}
						<li>
							<Link href={"/services"}>Services</Link>
						</li>
						<li>
							<a>Industries</a>
						</li>
						<li>
							<a>Work</a>
						</li>
						<li>
							<a>Locations</a>
						</li>
						<li>
							<a>Igil Advantage</a>
						</li>
						<li>
							<a>Careers</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default PublicLayout;
