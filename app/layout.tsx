import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const rubik = Rubik({
	variable: "--font-rubik",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "IDAN GLOBAL INSPECTION LIMITED (IGIL) - Leading NDT Services in Nigeria",
		template: "%s | IDAN GLOBAL INSPECTION LIMITED",
	},
	description:
		"IDAN GLOBAL INSPECTION LIMITED (IGIL) is a leading provider of Non-Destructive Testing (NDT) services in Nigeria. We offer UT, MPI, DPI, RT/RFI, VT/VE, PMI, Hardness Testing, and NDT equipment sales. ISO 9712 and ASNT Level II certified professionals ensuring safety, quality, and reliability across all industries.",
	keywords: [
		"NDT services Nigeria",
		"Non-Destructive Testing",
		"Ultrasonic Testing",
		"Magnetic Particle Inspection",
		"Dye Penetrant Inspection",
		"Radiographic Testing",
		"Visual Testing",
		"Positive Material Identification",
		"Hardness Testing",
		"NDT equipment sales",
		"ISO 9712 certified",
		"ASNT Level II",
		"Industrial inspection",
		"Quality assurance",
		"Safety testing",
		"Material testing",
		"Welding inspection",
		"Pipeline inspection",
		"Pressure vessel testing",
		"Structural integrity testing",
	],
	authors: [{ name: "IDAN GLOBAL INSPECTION LIMITED" }],
	creator: "IDAN GLOBAL INSPECTION LIMITED",
	publisher: "IDAN GLOBAL INSPECTION LIMITED",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://igil.net",
		title: "IDAN GLOBAL INSPECTION LIMITED (IGIL) - Leading NDT Services in Nigeria",
		description:
			"Leading provider of Non-Destructive Testing (NDT) services in Nigeria. ISO 9712 and ASNT Level II certified professionals ensuring safety, quality, and reliability across all industries.",
		siteName: "IDAN GLOBAL INSPECTION LIMITED",
		images: [
			{
				url: "/images/cover.png",
				width: 1200,
				height: 630,
				alt: "IDAN GLOBAL INSPECTION LIMITED Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "IDAN GLOBAL INSPECTION LIMITED (IGIL) - Leading NDT Services in Nigeria",
		description:
			"Leading provider of Non-Destructive Testing (NDT) services in Nigeria. ISO 9712 and ASNT Level II certified professionals.",
		images: ["/images/cover.png"],
	},
	alternates: {
		canonical: "https://igil.net",
	},
	category: "Industrial Services",
	classification: "Non-Destructive Testing Services",
	other: {
		"geo.region": "NG",
		"geo.placename": "Nigeria",
		"geo.position": "9.0820;8.6753",
		ICBM: "9.0820, 8.6753",
		"DC.title": "IDAN GLOBAL INSPECTION LIMITED (IGIL)",
		"DC.description": "Leading provider of Non-Destructive Testing (NDT) services in Nigeria",
		"DC.subject": "NDT, Non-Destructive Testing, Industrial Inspection, Quality Assurance",
		"DC.creator": "IDAN GLOBAL INSPECTION LIMITED",
		"DC.publisher": "IDAN GLOBAL INSPECTION LIMITED",
		"DC.contributor": "IDOGHOR ANTHONY URUEMU",
		"DC.date": "2024",
		"DC.type": "Service",
		"DC.format": "text/html",
		"DC.identifier": "https://igil.net",
		"DC.language": "en",
		"DC.coverage": "Nigeria",
		"DC.rights": "Copyright © 2024 IDAN GLOBAL INSPECTION LIMITED. All rights reserved.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/images/logo.png" />
				<meta name="theme-color" content="#dc2626" />
				<meta name="msapplication-TileColor" content="#dc2626" />
				<meta name="application-name" content="IDAN GLOBAL INSPECTION LIMITED" />
				<meta name="apple-mobile-web-app-title" content="IGIL" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-config" content="/browserconfig.xml" />
				<meta name="msapplication-TileImage" content="/images/logo.png" />
				<meta name="msapplication-tap-highlight" content="no" />

				{/* Structured Data for Organization */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "IDAN GLOBAL INSPECTION LIMITED",
							alternateName: "IGIL",
							url: "https://igil.net",
							logo: "https://igil.net/images/logo.png",
							description:
								"Leading provider of Non-Destructive Testing (NDT) services in Nigeria",
							foundingDate: "2010",
							address: {
								"@type": "PostalAddress",
								addressCountry: "Nigeria",
							},
							contactPoint: {
								"@type": "ContactPoint",
								contactType: "customer service",
								availableLanguage: "English",
							},
							sameAs: [
								"https://www.linkedin.com/company/idan-global-inspection-limited",
								"https://www.facebook.com/idan.global.inspection",
							],
							hasOfferCatalog: {
								"@type": "OfferCatalog",
								name: "NDT Services",
								itemListElement: [
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Ultrasonic Testing (UT)",
											description:
												"Non-destructive testing using ultrasonic waves",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Magnetic Particle Inspection (MPI)",
											description:
												"Surface and near-surface flaw detection",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Dye Penetrant Inspection (DPI)",
											description:
												"Surface-breaking defect detection",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Radiographic Testing (RT/RFI)",
											description:
												"Internal defect detection using X-rays",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Visual Testing (VT/VE)",
											description:
												"Direct visual examination of materials",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Positive Material Identification (PMI)",
											description:
												"Material composition verification",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Hardness Testing",
											description:
												"Material hardness verification",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "NDT Equipment Sales",
											description:
												"Professional NDT equipment sales and support",
										},
									},
								],
							},
							employee: {
								"@type": "Person",
								name: "IDOGHOR ANTHONY URUEMU",
								jobTitle: "CEO & Founder",
								worksFor: {
									"@type": "Organization",
									name: "IDAN GLOBAL INSPECTION LIMITED",
								},
							},
							areaServed: {
								"@type": "Country",
								name: "Nigeria",
							},
							serviceArea: {
								"@type": "Country",
								name: "Nigeria",
							},
							knowsAbout: [
								"Non-Destructive Testing",
								"Ultrasonic Testing",
								"Magnetic Particle Inspection",
								"Dye Penetrant Inspection",
								"Radiographic Testing",
								"Visual Testing",
								"Positive Material Identification",
								"Hardness Testing",
								"ISO 9712",
								"ASNT Level II",
								"Industrial Safety",
								"Quality Assurance",
							],
							award: [
								"ISO 9712 Certification",
								"ASNT Level II Certification",
							],
						}),
					}}
				/>
			</head>
			<body className={`${rubik.variable} antialiased`}>{children}</body>
		</html>
	);
}
