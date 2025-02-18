// Display a detailed view of a single event.
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useEventStore } from "@/store/eventStore";
import { EventType } from "@/types/events";

export default function ViewEventPage() {
	const pathname = usePathname();
	const id = pathname.split("/").pop();

	const eventId = id ? parseInt(id, 10) : null;

	const { getEventById, setEvents } = useEventStore();

	const [event, setEvent] = useState<EventType>();

	return <div></div>;
}
