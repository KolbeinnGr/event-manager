// Display a list of events that user has access to.
"use client";

import React, { useEffect } from "react";
import { useEventStore } from "@/store/eventStore";
import { EventType } from "@/types/events";

export default function ViewAllEventsPage() {
	const { events, setEvents } = useEventStore();

	useEffect(() => {
		fetch("/api/events")
			.then((res) => res.json())
			.then((data) => {
				setEvents(data.events);
			})
			.catch((error) => console.log("Error fetching events: ", error));
	}, [setEvents]);

	return (
		<div>
			<h1>All events:</h1>
			{events.map((event: EventType) => (
				<div key={event.id}>
					<h2>{event.title}</h2>
					<p>{event.shortDescription}</p>
				</div>
			))}
		</div>
	);
}
