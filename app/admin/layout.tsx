import { auth } from "@/lib/auth";
import { Images, LayoutDashboard, Menu, Settings, X } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import LogoutBtn from "./__components/logout-btn";

interface AdminLayoutProps {
	children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
	const session = await auth.api.getSession({
		headers: await headers(), // pass the headers
	});

	// console.log({ session });

	if (!session) return redirect("/");

	return (
		<div className="drawer lg:drawer-open">
			<input id="admin-drawer" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				{/* Navbar */}
				<div className="navbar bg-base-300 lg:hidden">
					<div className="flex-none">
						<label htmlFor="admin-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
							<Menu className="w-6 h-6" />
						</label>
					</div>
					<div className="flex-1">
						<Link href="/admin" className="btn btn-ghost normal-case text-xl">
							IGIL Admin
						</Link>
					</div>
				</div>

				{/* Page content */}
				<div className="flex-1 p-4 lg:p-8">{children}</div>
			</div>

			{/* Sidebar */}
			<div className="drawer-side z-50">
				<label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
				<div className="menu bg-base-200 text-base-content min-h-full w-80 p-4 relative">
					{/* Logo */}
					<label htmlFor="admin-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost absolute top-1 right-1 lg:hidden">
						<X className="w-6 h-6" />
					</label>
					<div className="mb-8 mt-4 flex items-center justify-center">
						<Link href="/admin/dashboard" className="flex items-center gap-2">
							<div className="relative w-12 h-12">
								<Image src="/images/logo.png" alt="IGIL Logo" fill className="object-contain" sizes="48px" />
							</div>
							<span className="text-xl font-bold">IGIL Admin</span>
						</Link>
					</div>
					{/* Navigation */}
					<ul className="space-y-2">
						<li>
							<Link href="/admin/dashboard" className={`flex items-center gap-3`}>
								<LayoutDashboard className="w-5 h-5" />
								Dashboard
							</Link>
						</li>
						<li>
							<Link href="/admin/gallery" className={`flex items-center gap-3`}>
								<Images className="w-5 h-5" />
								Gallery Management
							</Link>
						</li>
						<li>
							<Link href="/admin/settings" className={`flex items-center gap-3`}>
								<Settings className="w-5 h-5" />
								Settings
							</Link>
						</li>
					</ul>{" "}
					{/* Logout Button */}
					<div className="mt-auto pt-8">
						<LogoutBtn />
					</div>
				</div>
			</div>
		</div>
	);
}
