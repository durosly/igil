import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "./__components/register-form";

export const metadata: Metadata = {
	title: "Student Sign Up",
	description: "Create your student account",
};

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 p-4">
			<div className="card bg-base-100 shadow-xl w-full max-w-md">
				<div className="card-body">
					<div className="flex justify-center mb-6">
						<div className="relative w-20 h-20">
							<Image src="/images/logo.png" alt="IGIL Logo" fill className="object-contain" sizes="80px" />
						</div>
					</div>
					<h1 className="text-3xl font-bold text-center mb-2">Student Sign Up</h1>
					<p className="text-center text-gray-600 mb-6">
						Create an account to register for programs
					</p>
					<RegisterForm />
					<p className="text-center text-sm mt-4">
						Already have an account?{" "}
						<Link href="/login" className="link link-primary">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
