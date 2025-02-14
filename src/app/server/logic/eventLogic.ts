import { verifyDates } from "../helpers/dateHelper";
import { DatabaseService } from "../database/databaseService";
import { Event } from "@/types/events";

export class EventManager {
	private db: DatabaseService;
	constructor(db: DatabaseService) {
		this.db = db;
	}

	async createEvent(eventData: Event) {
		return;
	}

	async getEvent(eventId: number) {
		return await this.db.getEventById(eventId);
	}

	async getEventByUuid(eventId: string) {
		return await this.db.getEventByUuid(eventId);
	}

	async testFunction(id: string) {
		console.log("Getting event with id: ", id);

		return await this.db.getEventByUuid(id);
	}
}
