"use client";

import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // for month view
import timeGridPlugin from "@fullcalendar/timegrid"; // for week/day view
import listPlugin from "@fullcalendar/list"; // for list view
import { useEventStore } from "@/store/eventStore";
import { EventType } from "@/types/events";
import { useRouter } from "next/navigation";

export default function ViewAllEventsPage() {
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
		<div className="flex justify-center">
			<div className="w-3/4">
				<h1>All Events</h1>
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
					height="auto"
					eventClick={(info) => {
						console.log(info.event);
						router.push(`/events/${info.event.id}`);
					}}
				/>
			</div>
		</div>
	);
}
