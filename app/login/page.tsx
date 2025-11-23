import Image from "next/image";
import LoginForm from "./__components/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
	const session = await auth.api.getSession({
		headers: await headers(), // pass the headers
	});

	// console.log({ session });

	if (!!session) return redirect("/admin/dashboard");

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

					<h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
					<p className="text-center text-gray-600 mb-6">
						Sign in to access the admin panel
					</p>

					<LoginForm />
				</div>
			</div>
		</div>
	);
}
