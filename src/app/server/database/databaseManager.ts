import { PrismaClient } from "@prisma/client";
import { EventType } from "@/types/events";
import { colorPrint } from "../helpers/utils";

export class DatabaseManager {
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

	async createEvent(event: EventType) {
		// Make sure that the user exists in our system
		let owner = await this.getUserByEmail(event.owner.email);
		colorPrint(owner);
		console.log(owner);
		if (!owner) {
			// Create the user if they don't already exist.
			owner = await this.createUser(event.owner.name, event.owner.email);
		}

		// Ensure owner has an id
		if (!owner?.id) {
			throw new Error("Owner ID is required to create an event.");
		}

		const created_event = await this.db.event.create({
			data: {
				uuid: crypto.randomUUID(),
				title: event.title,
				description: event.description,
				shortDescription: event.shortDescription,
				image: event.image,
				startDate: event.startDate,
				endDate: event.endDate,
				location: event.location,
				recurring: event.recurring,
				recurringDetails: event.recurringDetails
					? {
							create: {
								type: event.recurringDetails.type,
								interval: event.recurringDetails.interval,
								daysOfWeek:
									event.recurringDetails.daysOfWeek || [],
								dayOfMonth: event.recurringDetails.dayOfMonth,
								weekOfMonth: event.recurringDetails.weekOfMonth,
								monthOfYear: event.recurringDetails.monthOfYear,
								startDate: event.recurringDetails.startDate,
								endDate: event.recurringDetails.endDate,
								customDates:
									event.recurringDetails.customDates || [],
							},
					  }
					: undefined,
				owner: {
					connect: { id: owner.id },
				},
				editors: event.editors
					? {
							connect: event.editors.map((u) => ({ id: u.id })),
					  }
					: undefined,
				notifyAttendees: event.notifyAttendees,
				signupOptions: event.signupOptions,
				theme: event.theme,
				status: event.status,
				visibility: event.visibility,
			},
		});

		console.log("Created event: ", created_event);
		return created_event;
	}

	async createUser(name: string, email: string) {
		if (!name || !email) throw new Error("Invalid parameters.");

		const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email address.");
		}

		const existingUser = await this.db.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			throw new Error("User with this email already exists.");
		}

		const user = await this.db.user.create({
			data: {
				name,
				email,
			},
		});

		return user;
	}

	async getUserByEmail(email: string) {
		const user = await this.db.user.findUnique({
			where: { email },
		});
		return user;
	}
}
