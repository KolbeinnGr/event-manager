import { PrismaClient } from "@prisma/client";
import { EventType } from "@/types/events";
import { colorPrint } from "../helpers/utils";

export class DatabaseManager {
	db = new PrismaClient();

	async getUserAccessToEvent(eventId: number, userId: number) {
		const event = await this.db.event.findUnique({
			where: { id: eventId },
			include: {
				owner: true,
				editors: true,
				attendees: {
					where: { userId },
					include: { user: true },
				},
			},
		});

		if (!event) {
			return null;
		}

		// Check if user is owner
		if (event.ownerId === userId) {
			return { role: "owner", event };
		}

		// Check if user is editor
		if (event.editors.some((editor) => editor.id === userId)) {
			return { role: "editor", event };
		}

		// Check if user is attendee
		const attendee = event.attendees[0];
		if (attendee) {
			return { role: attendee.role, event };
		}

		// Check if event is public
		if (event.visibility === "public") {
			return { role: "viewer", event };
		}

		return null;
	}

	async getEventById(id: number) {
		const event = await this.db.event.findUnique({
			where: { id },
			include: {
				owner: true,
				editors: true,
				recurringDetails: true,
				attendees: {
					include: {
						user: true,
					},
				},
			},
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
			include: {
				owner: true,
				editors: true,
				recurringDetails: true,
				attendees: {
					include: {
						user: true,
					},
				},
			},
		});

		if (!event) {
			throw new Error("Event was not found!");
		}
		return event;
	}

	async getUserById(id: number) {
		const user = await this.db.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new Error("User was not found!");
		}

		return user;
	}

	async getEventsByOwnerId(ownerId: number) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// First, get the latest event IDs for each UUID
		const latestEventIds = await this.db.event.groupBy({
			by: ["uuid"],
			where: {
				ownerId,
			},
			_max: {
				id: true,
			},
		});

		// Then fetch the complete event data for these latest versions
		const events = await this.db.event.findMany({
			where: {
				id: {
					in: latestEventIds
						.map((event) => event._max.id)
						.filter((id): id is number => id !== null),
				},
			},
			include: {
				owner: true,
				editors: true,
				recurringDetails: true,
				attendees: {
					include: {
						user: true,
					},
				},
			},
		});

		return events;
	}

	async createEvent(event: EventType) {
		// Make sure that the user exists in our system
		let owner = await this.getUserByEmail(event.owner.email);
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

		return created_event;
	}

	async updateEvent(uuid: string, event: EventType) {
		// Get the existing event to ensure it exists
		const existingEvent = await this.getEventByUuid(uuid);
		// Make sure that the user exists in our system
		let owner = await this.getUserByEmail(event.owner.email);
		if (!owner) {
			// Create the user if they don't already exist.
			owner = await this.createUser(event.owner.name, event.owner.email);
		}

		// Ensure owner has an id
		if (!owner?.id) {
			throw new Error("Owner ID is required to update an event.");
		}

		// Create a new event with the same UUID but new data
		const updated_event = await this.db.event.create({
			data: {
				uuid: existingEvent.uuid, // Keep the same UUID
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

		return updated_event;
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
