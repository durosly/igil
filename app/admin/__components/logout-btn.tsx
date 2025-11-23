"use client";

import { authClient } from "@/lib/auth-client";
import { handleError } from "@/lib/handle-error";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function LogoutBtn() {
	const router = useRouter();
	async function handleLogout() {
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push("/"); // redirect to login page
					},
				},
			});
		} catch (error) {
			const message = handleError(error);
			toast.error(message);
		}
	}
	return (
		<button onClick={handleLogout} className="btn btn-error btn-block gap-2">
			<LogOut className="w-5 h-5" />
			Logout
		</button>
	);
}

export default LogoutBtn;
