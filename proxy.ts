import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/** Node.js runtime for full session validation (MongoDB, etc.) */
// export const runtime = "nodejs";

/**
 * All redirection is handled here for security.
 * Uses Node.js runtime to validate sessions server-side.
 */
export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	const role = (session?.user as { role?: string } | undefined)?.role ?? "";
	const isAdmin = pathname.startsWith("/admin");
	const isStudent = pathname.startsWith("/student");
	const isLogin = pathname === "/login" || pathname.startsWith("/login");
	const isRegister = pathname === "/register" || pathname.startsWith("/register");
	const isRoot = pathname === "/";

	// Only "admin" gets admin access; "student" and any other non-admin role use student routes
	const isAdminRole = role === "admin";
	const isStudentRole = !isAdminRole;

	// Logged-in users on login, register, or root -> redirect to role-based dashboard
	if (session?.user && (isLogin || isRegister || isRoot)) {
		const dashboard = isAdminRole ? "/admin/dashboard" : "/student/dashboard";
		return NextResponse.redirect(new URL(dashboard, request.url));
	}

	// Protected routes: require session
	if (isAdmin || isStudent) {
		if (!session?.user) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		// Role-based access: only admins on admin routes, students/users on student routes
		if (isAdmin && !isAdminRole) {
			return NextResponse.redirect(new URL("/student/dashboard", request.url));
		}
		if (isStudent && !isStudentRole) {
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/login", "/login/:path*", "/register", "/register/:path*", "/admin/:path*", "/api/admin/:path*", "/student/:path*"],
};
