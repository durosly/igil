import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const { pathname } = request.nextUrl;

	const isAdmin = pathname.startsWith("/admin");
	const isStudent = pathname.startsWith("/student");

	// Protect admin, api/admin, and student routes: require session and redirect to login
	if ((isAdmin || isStudent) && !sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/api/admin/:path*", "/student/:path*"],
};
