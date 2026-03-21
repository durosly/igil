"use client";

import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

type LoginFormValues = {
	email: string;
	password: string;
};

function LoginForm() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			const result = await authClient.signIn.email({
				email: data.email,
				password: data.password,
				callbackURL: "/",
			});

			if (result.error) {
				setError("root", {
					message: result.error.message || "Invalid email or password",
				});
				return;
			}
			// Redirect handled by proxy.ts via callbackURL -> /
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "An error occurred. Please try again.";
			setError("root", { message });
		}
	};

	return (
		<>
			{errors.root && (
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
					<span>{errors.root.message}</span>
				</div>
			)}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="fieldset">
					<label className="label" htmlFor="login-email">
						<span className="label-text">Email</span>
					</label>
					<input
						id="login-email"
						type="email"
						placeholder="you@example.com"
						className={`input input-bordered ${errors.email ? "input-error" : ""}`}
						disabled={isSubmitting}
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Please enter a valid email address",
							},
						})}
					/>
					{errors.email && (
						<p className="text-error text-sm mt-1">{errors.email.message}</p>
					)}
				</div>

				<div className="fieldset">
					<label className="label" htmlFor="login-password">
						<span className="label-text">Password</span>
					</label>
					<input
						id="login-password"
						type="password"
						placeholder="••••••••"
						className={`input input-bordered ${errors.password ? "input-error" : ""}`}
						disabled={isSubmitting}
						{...register("password", {
							required: "Password is required",
						})}
					/>
					{errors.password && (
						<p className="text-error text-sm mt-1">{errors.password.message}</p>
					)}
				</div>

				<div className="fieldset mt-6">
					<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<span className="loading loading-spinner" />
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
