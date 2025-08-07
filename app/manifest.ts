import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "IDAN GLOBAL INSPECTION LIMITED",
		short_name: "IGIL",
		description: "Leading provider of Non-Destructive Testing (NDT) services in Nigeria",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#dc2626",
		icons: [
			{
				src: "/images/logo.png",
				sizes: "any",
				type: "image/png",
			},
			{
				src: "/images/logo.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/images/logo.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
