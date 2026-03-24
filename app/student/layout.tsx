import { LayoutDashboard, BookOpen, Award, Settings, Menu, X, ClipboardList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import LogoutBtn from "@/app/admin/__components/logout-btn";

interface StudentLayoutProps {
	children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
	return (
		<div className="drawer lg:drawer-open">
			<input id="student-drawer" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				<div className="navbar bg-base-300 lg:hidden">
					<div className="flex-none">
						<label htmlFor="student-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
							<Menu className="w-6 h-6" />
						</label>
					</div>
					<div className="flex-1">
						<Link href="/student/dashboard" className="btn btn-ghost normal-case text-xl">
							IGIL Student
						</Link>
					</div>
				</div>
				<div className="flex-1 p-4 lg:p-8">{children}</div>
			</div>
			<div className="drawer-side z-50">
				<label htmlFor="student-drawer" aria-label="close sidebar" className="drawer-overlay" />
				<div className="menu bg-base-200 text-base-content min-h-full w-80 p-4 relative">
					<label htmlFor="student-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost absolute top-1 right-1 lg:hidden">
						<X className="w-6 h-6" />
					</label>
					<div className="mb-8 mt-4 flex items-center justify-center">
						<Link href="/student/dashboard" className="flex items-center gap-2">
							<div className="relative w-12 h-12">
								<Image src="/images/logo.png" alt="IGIL Logo" fill className="object-contain" sizes="48px" />
							</div>
							<span className="text-xl font-bold">IGIL Student</span>
						</Link>
					</div>
					<ul className="space-y-2">
						<li>
							<Link href="/student/dashboard" className="flex items-center gap-3">
								<LayoutDashboard className="w-5 h-5" />
								Dashboard
							</Link>
						</li>
						<li>
							<Link href="/student/enrollments" className="flex items-center gap-3">
								<ClipboardList className="w-5 h-5" />
								Enrollments
							</Link>
						</li>
						<li>
							<Link href="/student/programs" className="flex items-center gap-3">
								<BookOpen className="w-5 h-5" />
								Programs
							</Link>
						</li>
						<li>
							<Link href="/student/certificates" className="flex items-center gap-3">
								<Award className="w-5 h-5" />
								Certificates
							</Link>
						</li>
						<li>
							<Link href="/student/settings" className="flex items-center gap-3">
								<Settings className="w-5 h-5" />
								Settings
							</Link>
						</li>
					</ul>
					<div className="mt-auto pt-8">
						<LogoutBtn />
					</div>
				</div>
			</div>
		</div>
	);
}
