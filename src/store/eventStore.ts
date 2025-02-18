import { create } from "zustand";
import { EventType } from "@/types/events";

interface EventState {
	events: EventType[];
	setEvents: (events: EventType[]) => void;
	addEvent: (event: EventType) => void;
	updateEvent: (event: EventType) => void;
	removeEvent: (event: number) => void;
	getEventById: (id: number) => EventType | undefined;
}

export const useEventStore = create<EventState>((set, get) => ({
	events: [],
	setEvents: (events: EventType[]) => set({ events }),
	addEvent: (event: EventType) =>
		set((state) => ({
			events: [...state.events, event],
		})),
	updateEvent: (updatedEvent: EventType) =>
		set((state) => ({
			events: state.events.map((event) =>
				event.id === updatedEvent.id ? updatedEvent : event
			),
		})),
	removeEvent: (id: number) =>
		set((state) => ({
			events: state.events.filter((event) => event.id !== id),
		})),
	getEventById: (id: number) => get().events.find((event) => event.id === id),
}));
