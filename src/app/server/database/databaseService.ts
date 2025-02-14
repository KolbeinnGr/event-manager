import { PrismaClient } from "@prisma/client";
import { Event } from "@/types/events";

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

	async createEvent(event: Event) {
		let new_event = event;
		new_event.uuid = crypto.randomUUID();

		return await this.db.event.create({
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
					connect: { id: event.owner.id },
				},

				// Editors (optional, connecting to existing users)
				editors: event.editors
					? {
							connect: event.editors.map((u) => ({ id: u.id })),
					  }
					: undefined,

				// Attendees come from a join table; you could connect them similarly if needed:
				// attendees: { connect: event.attendees.map(u => ({ id: u.id })) },

				notifyAttendees: event.notifyAttendees,

				// JSON fields can be provided as objects
				signupOptions: event.signupOptions,
				theme: event.theme,

				status: event.status, // draft, published, cancelled
				visibility: event.visibility, // Public, Private,
			},
		});
	}

	async createAttendee(name: string, email: string) {
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
}
