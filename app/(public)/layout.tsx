import type { ReactNode } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<div className="drawer">
			<Script src="/js/hotjar.js" strategy="lazyOnload" />
			<input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				{/* Sticky Header */}
				<header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-2">
					<div className="container mx-auto px-4">
						<div className="flex items-center justify-between h-16">
							{/* Logo Section */}
							<Link
								href={"/"}
								className="flex gap-2 items-center justify-center">
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
							</Link>

							{/* Desktop Navigation */}
							<nav className="hidden lg:flex items-center space-x-8">
								<Link
									href="/services"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Services
								</Link>
								<Link
									href="/industries"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Industries
								</Link>
								<Link
									href="/work"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Work
								</Link>
								<Link
									href="/locations"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Locations
								</Link>
								<Link
									href="/about-us"
									className="text-gray-600 hover:text-gray-900 font-medium text-sm uppercase tracking-wide transition-colors">
									Igil Advantage
								</Link>
							</nav>

							{/* Right Icons */}
							<div className="flex items-center space-x-4">
								{/* Contact Icon */}
								<Link
									href={"/contact-us"}
									className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
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
								</Link>

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
									IDAN GLOBAL INTEGRATED LIMITED
								</div>
								<p className="text-gray-400 mb-2">
									Your trusted partner in reliable NDT solutions,
									ensuring safety, quality, and reliability across
									all industries.
								</p>
								<p className="text-xs text-gray-500">RC: 8985106</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-4">
									Quick Links
								</h3>
								<ul className="space-y-2">
									<li>
										<Link
											href="/services"
											className="footer-link">
											Services
										</Link>
									</li>
									<li>
										<Link
											href="/about-us"
											className="footer-link">
											About US
										</Link>
									</li>
									<li>
										<Link
											href="/industries"
											className="footer-link">
											Industries
										</Link>
									</li>
									<li>
										<Link
											href="/locations"
											className="footer-link">
											Locations
										</Link>
									</li>
									<li>
										<Link
											href="/work"
											className="footer-link">
											Completed Jobs
										</Link>
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
									<p>Email: info@igil.net</p>
									<p>
										Phone:{" "}
										<a
											href="tel:+2349034840287"
											className="text-gray-400 hover:text-white">
											+2349034840287
										</a>
										,{" "}
										<a
											href="tel:+2349040034933"
											className="text-gray-400 hover:text-white">
											+2349040034933
										</a>
										,{" "}
										<a
											href="tel:+2349034840287"
											className="text-gray-400 hover:text-white">
											+2349034840287
										</a>
									</p>
									{/* <p>Address: [Your Address]</p> */}
								</div>
							</div>
						</div>

						<div className="border-t border-gray-800 mt-12 pt-8 text-center">
							<div className="text-gray-400 text-sm">
								©2025 IGIL - IDAN GLOBAL INTEGRATED LIMITED. All rights
								reserved.
							</div>
							<div className="text-gray-400 text-sm mt-2">RC: 8985106</div>
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
							sizes="30px"
						/>
					</div>
					<ul className="menu ">
						{/* Sidebar content here */}
						<li>
							<Link href={"/services"}>Services</Link>
						</li>
						<li>
							<Link href={"/industries"}>Industries</Link>
						</li>
						<li>
							<Link href="/work">Work</Link>
						</li>
						<li>
							<Link href="/locations">Locations</Link>
						</li>
						<li>
							<Link href="/about-us"> Igil Advantage</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default PublicLayout;
