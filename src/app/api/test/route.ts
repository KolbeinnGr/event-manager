// src/app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EventManager } from "@/app/server/logic/eventLogic";
import { DatabaseService } from "@/app/server/database/databaseService";

export async function GET(request: NextRequest) {
	try {
		// Instantiate your database service and event manager.
		const dbService = new DatabaseService();
		const eventManager = new EventManager(dbService);

		// For testing, we'll call testFunction with a sample id (e.g., 1).
		const result = await eventManager.testFunction(
			"f32344c7-717e-4ec5-b422-ea7af791d51f"
		);
		return NextResponse.json({ success: true, result });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		// Get the request body (assumed to be JSON with appropriate event data)
		const body = await request.json();

		// Instantiate your database service and event manager.
		const dbService = new DatabaseService();
		const eventManager = new EventManager(dbService);

		// Call the createEvent method (you need to implement the logic inside createEvent)
		const result = await eventManager.createEvent(body);
		return NextResponse.json({ success: true, result });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
