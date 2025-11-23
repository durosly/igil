"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await authClient.signIn.email({
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message || "Invalid email or password");
			} else {
				router.push("/admin/dashboard");
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "An error occurred. Please try again.";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{error && (
				<div className="alert alert-error mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{error}</span>
				</div>
			)}
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="form-control">
					<label className="label">
						<span className="label-text">Email</span>
					</label>
					<input
						type="email"
						placeholder="admin@example.com"
						className="input input-bordered"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={loading}
					/>
				</div>

				<div className="form-control">
					<label className="label">
						<span className="label-text">Password</span>
					</label>
					<input
						type="password"
						placeholder="••••••••"
						className="input input-bordered"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						disabled={loading}
					/>
				</div>

				<div className="form-control mt-6">
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? (
							<>
								<span className="loading loading-spinner"></span>
								Signing in...
							</>
						) : (
							"Sign In"
						)}
					</button>
				</div>
			</form>
		</>
	);
}

export default LoginForm;
