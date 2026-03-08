import Image from "next/image";
import Link from "next/link";
import LoginForm from "./__components/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session?.user) {
		const role = (session.user as { role?: string }).role;
		if (role === "admin") return redirect("/admin/dashboard");
		if (role === "student") return redirect("/student/dashboard");
		return redirect("/admin/dashboard");
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 p-4">
			<div className="card bg-base-100 shadow-xl w-full max-w-md">
				<div className="card-body">
					{/* Logo */}
					<div className="flex items-center justify-center mb-6">
						<div className="relative w-20 h-20">
							<Image
								src="/images/logo.png"
								alt="IGIL Logo"
								fill
								className="object-contain"
								sizes="80px"
							/>
						</div>
					</div>

					<h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
					<p className="text-center text-gray-600 mb-6">
						Sign in to your account
					</p>

					<LoginForm />
					<p className="text-center text-sm mt-4">
						Don&apos;t have an account? <Link href="/register" className="link link-primary">Sign up here</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
