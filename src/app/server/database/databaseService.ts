import { PrismaClient } from "@prisma/client";

export class DatabaseService {
	db = new PrismaClient();

	async getEventById(id: number) {
		console.log(id);
		const event = await this.db.event.findUnique({
			where: { id },
		});

		if (!event) {
			throw new Error("Event was not found!");
		}

		return event;
	}

	async getEventByUuid(uuid: string) {
		const event = await this.db.event.findFirst({
			where: { uuid },
			orderBy: { updatedAt: "desc" },
		});

		if (!event) {
			throw new Error("Event was not found!");
		}
		console.log("Event found: ", event);
		return event;
	}

	async getEventsByOwnerId(ownerId: number) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const events = await this.db.event.findMany({
			where: {
				ownerId,
				startDate: {
					gte: today,
				},
			},
		});

		if (events.length === 0) {
			throw new Error("No events found");
		}

		return events;
	}
}
