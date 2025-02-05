"use client";

import React, { useState } from "react";
import { Event } from "@/types/events";

export default function CreateEventPage() {
	const [event, setEvent] = useState<Event>({
		id: "", // This will eventually be generated when submitted
		image: "",
		shortDescription: "",
		title: "",
		description: "",
		location: "",
		startDate: "",
		endDate: "",
		recurring: false,
		attendees: [],
		notifyAttendees: false,
		status: "draft",
		visibility: "public",
		openForSignup: false,
		attendeeSignupDeadline: "",
		owner: {
			id: "",
			name: "",
			email: "",
		},
		createdAt: "",
		updatedAt: "",
	});

	const handleChange = (updatedEvent: Partial<Event>) => {
		setEvent((prev: any) => ({ ...prev, ...updatedEvent }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Event Created:", event);

		// Send the event data to the API
		fetch("/api/events", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(event),
		}).then((res) => {
			if (res.ok) {
				console.log("Event created successfully");
			} else {
				console.error("Failed to create event");
			}
		});
	};

	return (
		<div className="text-blue-500" style={{ padding: "20px" }}>
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
						onChange={(e) => handleChange({ title: e.target.value })}
						required
					/>
				</label>
				<label>
					Short Description:
					<input
						type="text"
						value={event.shortDescription}
						onChange={(e) => handleChange({ shortDescription: e.target.value })}
						required
					/>
				</label>
				<label>
					Description:
					<textarea
						value={event.description}
						onChange={(e) => handleChange({ description: e.target.value })}
						required
					/>
				</label>
				<label>
					Location:
					<input
						type="text"
						value={event.location}
						onChange={(e) => handleChange({ location: e.target.value })}
						required
					/>
				</label>
				<label>
					Start Date:
					<input
						type="datetime-local"
						value={event.startDate}
						onChange={(e) => handleChange({ startDate: e.target.value })}
						required
					/>
				</label>
				<label>
					End Date:
					<input
						type="datetime-local"
						value={event.endDate}
						onChange={(e) => handleChange({ endDate: e.target.value })}
					/>
				</label>
				<label>
					Image URL:
					<input type="text" value={event.image} onChange={(e) => handleChange({ image: e.target.value })} />
				</label>
				<button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
					Create Event
				</button>
			</form>
		</div>
	);
}
