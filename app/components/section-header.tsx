"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type PathInfo = {
	title: string;
	linkInfo: string;
	desc: string;
};

function getPathInfo(path: string): PathInfo {
	if (path === "/services") {
		return {
			title: "Our Services",
			linkInfo: "Services",
			desc: "What we offer",
		};
	} else if (path === "/about-us") {
		return {
			title: "About Us",
			linkInfo: "About Us",
			desc: "Discover our story, mission, and the team behind our success",
		};
	} else if (path === "/industries") {
		return {
			title: "Our Industries",
			linkInfo: "Industries",
			desc: "Areas you can find us",
		};
	} else if (path === "/work") {
		return {
			title: "Work",
			linkInfo: "Work",
			desc: "Work we have done",
		};
	} else if (path === "/locations") {
		return {
			title: "Locations",
			linkInfo: "Locations",
			desc: "Nationwide availability",
		};
	}

	return {
		title: "Default",
		linkInfo: "Default Page",
		desc: "Default page is been displayed",
	};
}

function SectionHeader() {
	const pathname = usePathname();
	const pathInfo = getPathInfo(pathname);

	return (
		<section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
			{/* Background Image with Blur Effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
				{/* Industrial Background Pattern */}
				<div className="absolute inset-0 opacity-20">
					<div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-500 rounded-full blur-xl"></div>
					<div className="absolute top-1/3 right-1/3 w-24 h-24 bg-orange-400 rounded-full blur-lg"></div>
					<div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-primary rounded-full blur-xl"></div>
					<div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-yellow-300 rounded-full blur-md"></div>
				</div>

				{/* Machinery Silhouettes */}
				<div className="absolute bottom-0 left-0 w-full h-1/3">
					<div className="absolute bottom-0 left-1/4 w-32 h-24 bg-gray-800 rounded-t-lg opacity-60"></div>
					<div className="absolute bottom-0 right-1/3 w-40 h-20 bg-gray-700 rounded-t-xl opacity-50"></div>
					<div className="absolute bottom-0 right-1/6 w-24 h-16 bg-gray-600 rounded-t-md opacity-40"></div>
				</div>

				{/* Material Piles */}
				<div className="absolute bottom-0 left-0 w-full h-1/4">
					<div className="absolute bottom-0 left-0 w-48 h-20 bg-gray-900 rounded-tr-full opacity-70"></div>
					<div className="absolute bottom-0 left-16 w-32 h-16 bg-gray-800 rounded-tr-full opacity-60"></div>
				</div>
			</div>

			{/* Red Accent Line */}
			<div className="absolute bottom-8 right-8 w-32 h-1 bg-primary transform rotate-12 opacity-80"></div>

			{/* Content Overlay */}
			<div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
				{/* Breadcrumb Navigation */}
				<nav className="mb-4 text-sm md:text-base">
					<ol className="flex items-center space-x-2 text-gray-300">
						<li>
							<Link
								href="/"
								className="hover:text-white transition-colors duration-200">
								Home
							</Link>
						</li>
						<li className="text-gray-500">/</li>
						<li className="text-white font-medium">{pathInfo.linkInfo}</li>
					</ol>
				</nav>

				{/* Main Title */}
				<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wide">
					{pathInfo.title}
				</h1>

				{/* Optional Subtitle */}
				<p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
					{pathInfo.desc}
				</p>
			</div>

			{/* Overlay Gradient for Better Text Readability */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
		</section>
	);
}

export default SectionHeader;
