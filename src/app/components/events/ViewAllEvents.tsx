"use client";

import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // for month view
import timeGridPlugin from "@fullcalendar/timegrid"; // for week/day view
import listPlugin from "@fullcalendar/list"; // for list view
import { useEventStore } from "@/store/eventStore";
import { EventType } from "@/types/events";
import { useRouter } from "next/navigation";

export default function ViewAllEvents() {
	const { events, setEvents } = useEventStore();
	const router = useRouter();

	useEffect(() => {
		fetch("/api/events")
			.then((res) => res.json())
			.then((data) => {
				console.log("Fetched events:", data);
				setEvents(data.events);
			})
			.catch((error) => console.log("Error fetching events: ", error));
	}, [setEvents]);

	const calendarEvents = events.map((event: EventType) => ({
		id: String(event.id),
		title: event.title,
		start: event.startDate,
		end: event.endDate,
	}));

	return (
		<div className="w-full max-w-5xl">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold text-gray-900">All Events</h1>
				<button
					onClick={() => router.push("/create-event")}
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Create New Event
				</button>
			</div>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
				initialView="dayGridMonth"
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
				}}
				eventTimeFormat={{
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}}
				slotLabelFormat={{
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}}
				events={calendarEvents}
				height={600}
				contentHeight="auto"
				eventClick={(info) => {
					console.log(info.event);
					router.push(`/events/${info.event.id}`);
				}}
			/>
		</div>
	);
}
