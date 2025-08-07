import SectionHeader from "@/app/components/section-header";
import { ReactNode } from "react";

function SectionLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<SectionHeader />

			{children}
		</>
	);
}

export default SectionLayout;
