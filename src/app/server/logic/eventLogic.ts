import { verifyDates } from "../helpers/dateHelper";
import { DatabaseService } from "../database/databaseService";
import { EventType } from "@/types/events";

export class EventManager {
	private db: DatabaseService;

	constructor(db: DatabaseService) {
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
			return {};
		}
		return new_event;
	}

	async getEvent(eventId: number) {
		const event = await this.db.getEventById(eventId);
		if (!event) {
			return {};
		}
		return event;
	}

	async getEventByUuid(eventId: string) {
		return await this.db.getEventByUuid(eventId);
	}

	async testFunction(id: string) {
		console.log("Getting event with id: ", id);

		return await this.db.getEventByUuid(id);
	}
}
