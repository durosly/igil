"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const registerSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
	});

	const onSubmit = async (data: RegisterFormValues) => {
		try {
			const result = await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
				role: "student",
			});

			if (result.error) {
				setError("root", {
					message: result.error.message ?? "Sign up failed",
				});
				return;
			}
			toast.success("Account created. Please check your email to verify before signing in.");
			router.push("/register/verify-email");
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Something went wrong";
			setError("root", { message });
		}
	};

	return (
		<>
			{errors.root && (
				<div className="alert alert-error mb-4">
					<span>{errors.root.message}</span>
				</div>
			)}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="form-control">
					<label className="label" htmlFor="register-name">
						<span className="label-text">Name</span>
					</label>
					<input
						id="register-name"
						type="text"
						className={`input input-bordered ${errors.name ? "input-error" : ""}`}
						disabled={isSubmitting}
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-error text-sm mt-1">{errors.name.message}</p>
					)}
				</div>

				<div className="form-control">
					<label className="label" htmlFor="register-email">
						<span className="label-text">Email</span>
					</label>
					<input
						id="register-email"
						type="email"
						placeholder="you@example.com"
						className={`input input-bordered ${errors.email ? "input-error" : ""}`}
						disabled={isSubmitting}
						{...register("email")}
					/>
					{errors.email && (
						<p className="text-error text-sm mt-1">{errors.email.message}</p>
					)}
				</div>

				<div className="form-control">
					<label className="label" htmlFor="register-password">
						<span className="label-text">Password</span>
					</label>
					<input
						id="register-password"
						type="password"
						placeholder="••••••••"
						className={`input input-bordered ${errors.password ? "input-error" : ""}`}
						disabled={isSubmitting}
						{...register("password")}
					/>
					<label className="label">
						<span className="label-text-alt">At least 8 characters</span>
					</label>
					{errors.password && (
						<p className="text-error text-sm mt-1">{errors.password.message}</p>
					)}
				</div>

				<div className="form-control">
					<label className="label" htmlFor="register-confirmPassword">
						<span className="label-text">Confirm password</span>
					</label>
					<input
						id="register-confirmPassword"
						type="password"
						placeholder="••••••••"
						className={`input input-bordered ${errors.confirmPassword ? "input-error" : ""}`}
						disabled={isSubmitting}
						{...register("confirmPassword")}
					/>
					{errors.confirmPassword && (
						<p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
					)}
				</div>

				<div className="form-control mt-6">
					<button
						type="submit"
						className="btn btn-primary"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<span className="loading loading-spinner" />
								Creating account...
							</>
						) : (
							"Sign up"
						)}
					</button>
				</div>
			</form>
		</>
	);
}
