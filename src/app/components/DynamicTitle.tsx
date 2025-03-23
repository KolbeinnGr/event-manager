"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useEventStore } from "@/store/eventStore";

export default function DynamicTitle() {
	const pathname = usePathname();
	const { fetchEvent } = useEventStore();

	useEffect(() => {
		const updateTitle = async () => {
			// Default title
			let title = "Event Manager";

			// Handle different routes
			if (pathname === "/") {
				title = "Event Manager - Home";
			} else if (pathname === "/events") {
				title = "Event Manager - Calendar";
			} else if (pathname === "/create-event") {
				title = "Event Manager - Create Event";
			} else if (pathname.startsWith("/events/")) {
				const parts = pathname.split("/");
				const id = parts[2];
				const isEdit = parts[3] === "edit";

				if (id) {
					try {
						const event = await fetchEvent(parseInt(id, 10));
						if (event) {
							title = isEdit
								? `Editing - ${event.title}`
								: event.title;
						}
					} catch (error) {
						console.error("Error fetching event for title:", error);
					}
				}
			}

			// Set the title, falling back to "Event Manager" if title is empty
			document.title = title || "Event Manager";
		};

		updateTitle();
	}, [pathname, fetchEvent]);

	return null;
}
