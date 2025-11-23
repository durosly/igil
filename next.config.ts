import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
			// Allow images from tebi.io - we'll extract hostname from TEBI_ENDPOINT
			...(process.env.TEBI_ENDPOINT
				? [
						{
							protocol: "https" as const,
							hostname: new URL(process.env.TEBI_ENDPOINT).hostname,
							pathname: "/**",
						},
				  ]
				: []),
		],
	},
};

export default nextConfig;
