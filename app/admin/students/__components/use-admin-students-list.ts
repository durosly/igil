"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
	adminStudentsQueryKey,
	type StudentsListPayload,
} from "./students-types";

export function useAdminStudentsList(
	initialPayload: StudentsListPayload
): {
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	pageSize: number;
	programId: string;
	setProgramId: (v: string) => void;
	profileFilter: "" | "yes" | "no";
	setProfileFilter: (v: "" | "yes" | "no") => void;
	qInput: string;
	setQInput: (v: string) => void;
	students: StudentsListPayload["students"];
	total: number;
	totalPages: number;
	hasActiveFilters: boolean;
} {
	const [page, setPage] = useState(initialPayload.page);
	const [programId, setProgramId] = useState("");
	const [profileFilter, setProfileFilter] = useState<"" | "yes" | "no">("");
	const [qInput, setQInput] = useState("");
	const [debouncedQ, setDebouncedQ] = useState("");

	useEffect(() => {
		const t = setTimeout(() => setDebouncedQ(qInput.trim()), 400);
		return () => clearTimeout(t);
	}, [qInput]);

	useEffect(() => {
		setPage(1);
	}, [programId, profileFilter, debouncedQ]);

	const pageSize = initialPayload.pageSize;

	const isInitialQuery =
		page === initialPayload.page &&
		programId === "" &&
		profileFilter === "" &&
		debouncedQ === "";

	const { data } = useQuery({
		queryKey: adminStudentsQueryKey(
			page,
			pageSize,
			programId,
			profileFilter,
			debouncedQ
		),
		queryFn: async () => {
			const { data: payload } = await axios.get<StudentsListPayload>(
				"/api/admin/students",
				{
					params: {
						page,
						pageSize,
						...(debouncedQ ? { q: debouncedQ } : {}),
						...(profileFilter ? { profileApproved: profileFilter } : {}),
						...(programId ? { programId } : {}),
					},
				}
			);
			return payload;
		},
		initialData: isInitialQuery ? initialPayload : undefined,
		placeholderData: (previousData) => previousData,
	});

	const payload =
		data ??
		(isInitialQuery
			? initialPayload
			: { students: [], total: 0, page, pageSize });

	const total = payload.total;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const hasActiveFilters = Boolean(debouncedQ || programId || profileFilter);

	return {
		page,
		setPage,
		pageSize,
		programId,
		setProgramId,
		profileFilter,
		setProfileFilter,
		qInput,
		setQInput,
		students: payload.students,
		total,
		totalPages,
		hasActiveFilters,
	};
}
