"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ViewEvent from "@/app/components/events/ViewEvent";
import { useEventStore } from "@/store/eventStore";

export default function ViewEventPage() {
	const pathname = usePathname();
	const id = parseInt(pathname.split("/")[2], 10); // Get the event ID from the URL
	const { fetchEvent } = useEventStore();
	const [backgroundColor, setBackgroundColor] = useState<string>("#f9fafb");

	useEffect(() => {
		const loadEvent = async () => {
			try {
				const event = await fetchEvent(id);
				if (event?.theme?.backgroundColor) {
					setBackgroundColor(event.theme.backgroundColor);
				}
			} catch (error) {
				console.error("Error loading event:", error);
			}
		};

		loadEvent();
	}, [id, fetchEvent]);

	return (
		<div
			className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
			style={{ backgroundColor }}
		>
			<ViewEvent eventId={id} />
		</div>
	);
}
