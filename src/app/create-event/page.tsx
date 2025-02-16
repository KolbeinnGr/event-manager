"use client";

import React, { useState } from "react";
import { EventType } from "@/types/events";

// Helper function to format a Date object for the datetime-local input
function formatDateForInput(date?: Date): string {
	if (!date) return "";
	// Convert to ISO string and then remove the seconds and milliseconds
	return date.toISOString().slice(0, 16);
}

export default function CreateEventPage() {
	// Initialize the event state. Note that we use new Date() as a default value.
	const [event, setEvent] = useState<EventType>({
		image: "",
		shortDescription: "",
		title: "",
		description: "",
		location: "",
		startDate: new Date(), // Default to current date/time
		endDate: new Date(), // Default to current date/time (or you might set it to null)
		recurring: false,
		attendees: [],
		notifyAttendees: false,
		status: "draft",
		visibility: "public",
		owner: {
			name: "",
			email: "",
		},
	});

	// Generic handler to update the event state
	const handleChange = (updatedEvent: Partial<EventType>) => {
		setEvent((prev) => ({ ...prev, ...updatedEvent }));
	};

	// When the form is submitted, convert Date objects to ISO strings
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const eventData = {
			...event,
			startDate: event.startDate.toISOString(),
			endDate: event.endDate ? event.endDate.toISOString() : null,
		};

		fetch("/api/events", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(eventData),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Failed to create event.");
				}
				return res.json();
			})
			.then((data) => {
				console.log("Event created successfully: ", data);
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Create Event</h1>
			<form
				onSubmit={handleSubmit}
				style={{
					display: "flex",
					flexDirection: "column",
					maxWidth: "500px",
					gap: "10px",
				}}
			>
				<label>
					Title:
					<input
						type="text"
						value={event.title}
						onChange={(e) =>
							handleChange({ title: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Short Description:
					<input
						type="text"
						value={event.shortDescription}
						onChange={(e) =>
							handleChange({ shortDescription: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Description:
					<textarea
						value={event.description}
						onChange={(e) =>
							handleChange({ description: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Location:
					<input
						type="text"
						value={event.location}
						onChange={(e) =>
							handleChange({ location: e.target.value })
						}
						required
					/>
				</label>
				<label>
					Start Date:
					<input
						type="datetime-local"
						value={formatDateForInput(event.startDate)}
						onChange={(e) =>
							handleChange({
								startDate: new Date(e.target.value),
							})
						}
						required
					/>
				</label>
				<label>
					End Date:
					<input
						type="datetime-local"
						value={formatDateForInput(event.endDate)}
						onChange={(e) =>
							handleChange({ endDate: new Date(e.target.value) })
						}
					/>
				</label>
				<label>
					Image URL:
					<input
						type="text"
						value={event.image}
						onChange={(e) =>
							handleChange({ image: e.target.value })
						}
					/>
				</label>
				<button
					type="submit"
					style={{ padding: "10px 20px", fontSize: "16px" }}
				>
					Create Event
				</button>
			</form>
		</div>
	);
}
