import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
			// R2 public bucket / custom domain (R2_PUBLIC_BASE_URL)
			...(process.env.R2_PUBLIC_BASE_URL
				? [
						{
							protocol: "https" as const,
							hostname: new URL(process.env.R2_PUBLIC_BASE_URL).hostname,
							pathname: "/**",
						},
				  ]
				: []),
		],
	},
};

export default nextConfig;
