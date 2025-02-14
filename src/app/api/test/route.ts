// src/app/api/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { EventManager } from "@/app/server/logic/eventLogic";
import { DatabaseService } from "@/app/server/database/databaseService";

export async function GET(request: NextRequest) {
	try {
		const dbService = new DatabaseService();
		const eventManager = new EventManager(dbService);

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
		const body = await request.json();

		const dbService = new DatabaseService();
		const eventManager = new EventManager(dbService);

		const result = await eventManager.createEvent(body);
		return NextResponse.json({ success: true, result });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
