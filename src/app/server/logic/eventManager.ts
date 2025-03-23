// import { verifyDates } from "../helpers/dateHelper";
import { DatabaseManager } from "../database/databaseManager";
import { EventType } from "@/types/events";

export class EventManager {
	private db: DatabaseManager;

	constructor(db: DatabaseManager) {
		this.db = db;
	}

	async createEvent(eventData: EventType) {
		// if (
		// 	eventData.endDate &&
		// 	!verifyDates(eventData.startDate, eventData.endDate)
		// ) {
		// 	return {};
		// }

		const new_event = await this.db.createEvent(eventData);
		if (!new_event) {
			console.log("Error creating event: ", eventData);
			throw new Error("Failed to create event");
		}
		return new_event;
	}

	async getEvent(eventId: number, userId: number) {
		const access = await this.db.getUserAccessToEvent(eventId, userId);

		if (!access) {
			throw new Error("Event not found or access denied");
		}

		return access.event;
	}

	async getEventByUuid(uuid: string) {
		const event = await this.db.getEventByUuid(uuid);
		if (!event) {
			throw new Error("Event not found");
		}
		return event;
	}

	async updateEvent(eventId: number, userId: number, eventData: EventType) {
		try {
			console.log("Starting updateEvent with ID:", eventId);
			console.log("Event data received:", eventData);

			// Check user access first
			const access = await this.db.getUserAccessToEvent(eventId, userId);
			if (!access) {
				throw new Error("Event not found or access denied");
			}

			// Only allow owners and editors to update
			if (access.role !== "owner" && access.role !== "editor") {
				throw new Error("You don't have permission to edit this event");
			}

			// First get the existing event to get its UUID
			const existingEvent = access.event;
			console.log("Existing event found:", existingEvent);

			if (!existingEvent.uuid) {
				throw new Error("Existing event has no UUID");
			}

			// Ensure the event data has the required fields
			if (!eventData.owner || !eventData.owner.email) {
				// If no owner provided, use the existing event's owner
				eventData.owner = existingEvent.owner;
			}

			// Update the event using the UUID
			const updatedEvent = await this.db.updateEvent(
				existingEvent.uuid,
				eventData
			);
			console.log("Event updated successfully:", updatedEvent);

			if (!updatedEvent) {
				throw new Error("Failed to update event");
			}
			return updatedEvent;
		} catch (error) {
			console.error("Error in updateEvent:", error);
			throw error;
		}
	}

	async testFunction(id: string) {
		return await this.db.getEventByUuid(id);
	}

	async getEvents(userId: number) {
		return await this.db.getEventsByOwnerId(userId);
	}
}

// Create singleton instances
const dbManager = new DatabaseManager();
export const eventManager = new EventManager(dbManager);
