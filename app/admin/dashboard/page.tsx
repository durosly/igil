import type { Metadata } from "next";
import connectDB from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Admin dashboard for IGIL",
};

export default async function AdminDashboardPage() {
	try {
		await connectDB();

		// Total number of images
		const totalImages = await GalleryImage.countDocuments();

		// Images created in the last 24 hours
		const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
		const recentActivity = await GalleryImage.countDocuments({
			createdAt: { $gte: since },
		});

		// Sum of file sizes (bytes) across all images
		const agg = await GalleryImage.aggregate([{ $group: { _id: null, totalBytes: { $sum: "$fileSize" } } }]);
		const totalBytes = Number(agg && agg.length ? agg[0].totalBytes || 0 : 0);
		const totalMB = totalBytes / 1024 / 1024;

		return (
			<div>
				<h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="stat bg-base-200 rounded-lg shadow">
						<div className="stat-title">Gallery Images</div>
						<div className="stat-value text-primary">{totalImages}</div>
						<div className="stat-desc">Total images in gallery</div>
					</div>
					<div className="stat bg-base-200 rounded-lg shadow">
						<div className="stat-title">Recent Activity</div>
						<div className="stat-value text-secondary">{recentActivity}</div>
						<div className="stat-desc">Last 24 hours</div>
					</div>
					<div className="stat bg-base-200 rounded-lg shadow">
						<div className="stat-title">Storage Used</div>
						<div className="stat-value text-accent">{totalMB.toFixed(2)} MB</div>
						<div className="stat-desc">Of available storage</div>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error("Error loading admin dashboard stats:", error);
		// Fallback UI when DB is unavailable
		return (
			<div>
				<h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="stat bg-base-200 rounded-lg shadow">
						<div className="stat-title">Gallery Images</div>
						<div className="stat-value text-primary">N/A</div>
						<div className="stat-desc">Total images in gallery</div>
					</div>
					<div className="stat bg-base-200 rounded-lg shadow">
						<div className="stat-title">Recent Activity</div>
						<div className="stat-value text-secondary">N/A</div>
						<div className="stat-desc">Last 24 hours</div>
					</div>
					<div className="stat bg-base-200 rounded-lg shadow">
						<div className="stat-title">Storage Used</div>
						<div className="stat-value text-accent">N/A</div>
						<div className="stat-desc">Of available storage</div>
					</div>
				</div>
			</div>
		);
	}
}
