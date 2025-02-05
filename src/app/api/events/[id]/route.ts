import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
	const session = await getServerSession(authOptions);

	// Check if the user is authenticated
	if (!session) {
		return {
			status: 401,
			body: { error: "Unauthorized: You must be signed in to access this API." },
		};
	}

	// Here we get the event with the specified ID from the database and return it if found and accessible by the user
	return {
		status: 200,
		body: { events: [] },
	};
}
