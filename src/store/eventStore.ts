import { create } from "zustand";
import { EventType } from "@/types/events";

interface EventState {
	events: EventType[];
	setEvents: (events: EventType[]) => void;
	addEvent: (event: EventType) => void;
	createEvent: (event: EventType) => Promise<EventType>;
	updateEvent: (event: EventType) => Promise<EventType>;
	removeEvent: (event: number) => void;
	getEventById: (id: number) => EventType | undefined;
	fetchEvent: (id: number) => Promise<EventType | undefined>;
}

export const useEventStore = create<EventState>((set, get) => ({
	events: [],
	setEvents: (events: EventType[]) => set({ events }),
	addEvent: (event: EventType) =>
		set((state) => ({
			events: [...state.events, event],
		})),
	createEvent: async (event: EventType) => {
		try {
			const response = await fetch("/api/events", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(event),
			});

			if (!response.ok) {
				throw new Error("Failed to create event");
			}

			const createdEvent = await response.json();
			set((state) => ({
				events: [...state.events, createdEvent],
			}));

			return createdEvent;
		} catch (error) {
			console.error("Error creating event:", error);
			throw error;
		}
	},
	updateEvent: async (updatedEvent: EventType) => {
		try {
			const response = await fetch(`/api/events/${updatedEvent.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedEvent),
			});

			if (!response.ok) {
				throw new Error("Failed to update event");
			}

			const data = await response.json();
			const event = data.event;

			set((state) => ({
				events: state.events.map((e) =>
					e.id === event.id || e.uuid === event.uuid ? event : e
				),
			}));

			return event;
		} catch (error) {
			console.error("Error updating event:", error);
			throw error;
		}
	},
	removeEvent: (id: number) =>
		set((state) => ({
			events: state.events.filter((event) => event.id !== id),
		})),
	getEventById: (id: number) => get().events.find((event) => event.id === id),
	fetchEvent: async (id: number) => {
		try {
			const response = await fetch(`/api/events/${id}`);
			const data = await response.json();
			if (data.event) {
				// Update the store with the fetched event
				set((state) => ({
					events: state.events.map((event) =>
						event.id === data.event.id ||
						event.uuid === data.event.uuid
							? data.event
							: event
					),
				}));
				return data.event;
			}
			return undefined;
		} catch (error) {
			console.error("Error fetching event:", error);
			return undefined;
		}
	},
}));
