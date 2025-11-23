import type { Metadata } from "next";
import ChangeEmailForm from "./__components/change-email-form";
import ChangePasswordForm from "./__components/change-password-form";

export const metadata: Metadata = {
	title: "Admin Settings",
	description: "Manage your account settings",
};

export default function AdminSettingsPage() {
	return (
		<div>
			<h1 className="text-4xl font-bold mb-8">Settings</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<ChangeEmailForm />
				<ChangePasswordForm />
			</div>
		</div>
	);
}
