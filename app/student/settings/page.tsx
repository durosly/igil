import type { Metadata } from "next";
import ChangePasswordForm from "@/app/admin/settings/__components/change-password-form";

export const metadata: Metadata = {
	title: "Settings",
	description: "Account settings",
};

export default function StudentSettingsPage() {
	return (
		<div>
			<h1 className="text-4xl font-bold mb-8">Settings</h1>
			<div className="max-w-md">
				<ChangePasswordForm />
			</div>
		</div>
	);
}
