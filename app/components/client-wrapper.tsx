"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";

function Clientwrapper({ children }: { children: ReactNode }) {
	return (
		<>
			{children}
			<Toaster />
		</>
	);
}

export default Clientwrapper;
