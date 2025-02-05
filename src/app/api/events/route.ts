import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	// Get session from the custom header
	const sessionHeader = request.headers.get("x-session");
	const session = sessionHeader ? JSON.parse(sessionHeader) : null;

	// Failsafe check for session. This should not happen due to the middleware handling this
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { title, description, location, startDate, endDate } = body;

	if (!title || !description || !location || !startDate) {
		return NextResponse.json(
			{ error: "Missing required fields: title, description, location, startDate" },
			{ status: 400 }
		);
	}

	const newEvent = {
		id: crypto.randomUUID(),
		...body,
		createdBy: session.email, // Use the authenticated user's email
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	return NextResponse.json(newEvent, { status: 201 });
}

export async function GET(request: NextRequest) {
	// Get session from the custom header
	const sessionHeader = request.headers.get("x-session");
	const session = sessionHeader ? JSON.parse(sessionHeader) : null;

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Fetch events that the user can access
	return NextResponse.json({ events: [] });
}
