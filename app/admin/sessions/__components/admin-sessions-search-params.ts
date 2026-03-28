import { createSerializer, parseAsStringLiteral, useQueryState } from "nuqs";

const adminSessionsCreateParser = parseAsStringLiteral(["1"] as const);

export const adminSessionsSearchParams = {
	create: adminSessionsCreateParser,
} as const;

export const serializeAdminSessionsUrl = createSerializer(adminSessionsSearchParams);

/** Path + query to open the new-session modal (aligned with `useAdminSessionsNewModal`). */
export const ADMIN_SESSIONS_NEW_MODAL_HREF = serializeAdminSessionsUrl("/admin/sessions", {
	create: "1",
});

export function useAdminSessionsNewModal() {
	const [flag, setFlag] = useQueryState("create", adminSessionsCreateParser);

	return {
		open: flag === "1",
		openModal: () => setFlag("1"),
		closeModal: () => setFlag(null),
	} as const;
}
