import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { eventManager } from "@/app/server/logic/eventManager";
import { Session } from "next-auth";

interface ExtendedSession extends Session {
	user: {
		id: number;
		name?: string | null;
		email?: string | null;
	};
}

export async function GET(request: NextRequest) {
	const session = (await getServerSession(authOptions)) as ExtendedSession;

	// Check if the user is authenticated
	if (!session?.user?.id) {
		return NextResponse.json(
			{
				error: "Unauthorized: You must be signed in to access this API.",
			},
			{ status: 401 }
		);
	}

	try {
		// Get the event ID from the URL
		const id = request.url.split("/").pop();
		if (!id) {
			return NextResponse.json(
				{ error: "Event ID is required" },
				{ status: 400 }
			);
		}

		// Assure that the event ID is a number
		const eventId = parseInt(id, 10);
		if (isNaN(eventId)) {
			return NextResponse.json(
				{ error: "Invalid event ID" },
				{ status: 400 }
			);
		}

		// Fetch the event using EventManager with user ID
		const event = await eventManager.getEvent(eventId, session.user.id);

		return NextResponse.json({ event });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to fetch event" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	const session = (await getServerSession(authOptions)) as ExtendedSession;

	// Check if the user is authenticated
	if (!session?.user?.id) {
		return NextResponse.json(
			{
				error: "Unauthorized: You must be signed in to access this API.",
			},
			{ status: 401 }
		);
	}

	try {
		// Get the event ID from the URL
		const id = request.url.split("/").pop();
		if (!id) {
			return NextResponse.json(
				{ error: "Event ID is required" },
				{ status: 400 }
			);
		}

		// Get the event data from the request body
		const eventData = await request.json();
		console.log("Received event data:", eventData);

		if (!eventData) {
			return NextResponse.json(
				{ error: "Event data is required" },
				{ status: 400 }
			);
		}

		// Ensure the event data has the required fields
		if (!eventData.owner) {
			eventData.owner = {
				name: session.user.name || "",
				email: session.user.email || "",
			};
		}

		// Update the event using EventManager with user ID
		const updatedEvent = await eventManager.updateEvent(
			parseInt(id, 10),
			session.user.id,
			eventData
		);

		return NextResponse.json({ event: updatedEvent });
	} catch (error: any) {
		console.error("Error in PUT /api/events/[id]:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to update event" },
			{ status: 500 }
		);
	}
}
