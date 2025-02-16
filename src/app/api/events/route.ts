import { NextResponse, NextRequest } from "next/server";
import { EventManager } from "@/app/server/logic/eventLogic";
import { DatabaseService } from "@/app/server/database/databaseService";
import { EventType } from "@/types/events";

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
			{
				error: "Missing required fields: title, description, location, startDate",
			},
			{ status: 400 }
		);
	}
	const dbService: DatabaseService = new DatabaseService();
	const eventManager: EventManager = new EventManager(dbService);

	const ev = await eventManager.getEvent(2);
	console.log(ev);

	const newEvent: EventType = {
		...body,
		owner: { name: session.name, email: session.email },
		createdBy: session.email, // Use the authenticated user's email
	};
	const created_event = await eventManager.createEvent(newEvent);
	console.log("Created event: ", created_event);
	return NextResponse.json(created_event, { status: 201 });
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
