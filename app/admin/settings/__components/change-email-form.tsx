"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ChangeEmailForm() {
	const [email, setEmail] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [confirmEmail, setConfirmEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !newEmail || !confirmEmail) {
			toast.error("All fields are required");
			return;
		}

		if (newEmail !== confirmEmail) {
			toast.error("New emails do not match");
			return;
		}

		if (newEmail === email) {
			toast.error("New email must be different from current email");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/user/change-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					currentEmail: email,
					newEmail: newEmail,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.message || "Failed to change email");
				return;
			}

			toast.success("Email changed successfully");
			setEmail("");
			setNewEmail("");
			setConfirmEmail("");
		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred while changing email");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl">
			<div className="card-body">
				<h2 className="card-title">Change Email Address</h2>

				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Current Email</span>
					</label>
					<input
						type="email"
						placeholder="your@email.com"
						className="input input-bordered w-full"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">New Email</span>
					</label>
					<input
						type="email"
						placeholder="newemail@email.com"
						className="input input-bordered w-full"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Confirm New Email</span>
					</label>
					<input
						type="email"
						placeholder="newemail@email.com"
						className="input input-bordered w-full"
						value={confirmEmail}
						onChange={(e) => setConfirmEmail(e.target.value)}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="card-actions justify-end mt-4">
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{isLoading ? "Changing..." : "Change Email"}
					</button>
				</div>
			</div>
		</form>
	);
}
