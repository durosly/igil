"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordForm() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPasswords, setShowPasswords] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!currentPassword || !newPassword || !confirmPassword) {
			toast.error("All fields are required");
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match");
			return;
		}

		if (newPassword === currentPassword) {
			toast.error("New password must be different from current password");
			return;
		}

		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/user/change-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					currentPassword,
					newPassword,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.message || "Failed to change password");
				return;
			}

			toast.success("Password changed successfully");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred while changing password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl">
			<div className="card-body">
				<h2 className="card-title">Change Password</h2>

				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Current Password</span>
					</label>
					<input
						type={showPasswords ? "text" : "password"}
						placeholder="Enter current password"
						className="input input-bordered w-full"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">New Password</span>
					</label>
					<input
						type={showPasswords ? "text" : "password"}
						placeholder="Enter new password (min 8 characters)"
						className="input input-bordered w-full"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Confirm New Password</span>
					</label>
					<input
						type={showPasswords ? "text" : "password"}
						placeholder="Confirm new password"
						className="input input-bordered w-full"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="form-control">
					<label className="label cursor-pointer">
						<span className="label-text">Show Passwords</span>
						<input type="checkbox" className="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} />
					</label>
				</div>

				<div className="card-actions justify-end mt-4">
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{isLoading ? "Changing..." : "Change Password"}
					</button>
				</div>
			</div>
		</form>
	);
}
