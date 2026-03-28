"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const queryClient = new QueryClient();

function Clientwrapper({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>{children}</NuqsAdapter>
			<Toaster />
		</QueryClientProvider>
	);
}

export default Clientwrapper;
