import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/api/auth/")) {
		return NextResponse.next({});
	}

	// Retrieve the session token
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	// If no token is found, block the request
	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Add session data to the request headers (as a base64 JSON string or similar)
	const modifiedRequest = req.clone();
	modifiedRequest.headers.set("x-session", JSON.stringify(token));

	return NextResponse.next({ request: modifiedRequest });
}

export const config = {
	matcher: ["/api/:path*"], // Apply middleware to all API routes
};
