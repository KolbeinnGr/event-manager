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

	const { events, getEventById, setEvents } = useEventStore();

	const [event, setEvent] = useState<EventType>();

	// This is to populate the events store if it is empty upon loading.
	useEffect(() => {
		if (events.length === 0) {
			fetch("/api/events")
				.then((res) => res.json())
				.then((data) => {
					console.log("Fetched events:", data);
					setEvents(data.events);
				})
				.catch((error) =>
					console.log("Error fetching events: ", error)
				);
		}
	}, [events.length, setEvents]);

	useEffect(() => {
		if (eventId !== null) {
			const fetchedEvent = getEventById(eventId);
			console.log("fetched event: ", fetchedEvent);
			setEvent(fetchedEvent);
		}
	}, [eventId, events, getEventById]);

	if (!event) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	// Get theme properties with fallbacks
	const theme = event.theme || {};
	const backgroundColor = theme.backgroundColor || "#f9fafb";
	const textColor = theme.textColor || "#1f2937";
	const accentColor = theme.accentColor || "#3b82f6";
	const bannerImage = theme.bannerImage || "";
	const fontFamily = theme.fontFamily || "sans-serif";
	const borderColor = theme.borderColor || "#e5e7eb";

	return (
		<div
			className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
			style={{
				backgroundColor,
				fontFamily,
				color: textColor,
			}}
		>
			<div className="max-w-4xl mx-auto">
				{/* Banner Image */}
				{bannerImage && (
					<div className="w-full h-64 mb-8 rounded-lg overflow-hidden">
						<img
							src={bannerImage}
							alt={event.title}
							className="w-full h-full object-cover"
						/>
					</div>
				)}

				<div
					className="bg-white shadow-xl rounded-lg overflow-hidden"
					style={{ borderColor }}
				>
					{/* Header Section */}
					<div className="px-6 py-8 border-b" style={{ borderColor }}>
						<h1
							className="text-3xl font-bold mb-4"
							style={{ color: textColor }}
						>
							{event.title}
						</h1>
						<p className="text-lg" style={{ color: textColor }}>
							{event.shortDescription}
						</p>
					</div>

					{/* Main Content */}
					<div className="px-6 py-8">
						<div className="space-y-6">
							{/* Description */}
							<div>
								<h2
									className="text-xl font-semibold mb-3"
									style={{ color: textColor }}
								>
									About This Event
								</h2>
								<p
									className="leading-relaxed"
									style={{ color: textColor }}
								>
									{event.description}
								</p>
							</div>

							{/* Location */}
							<div>
								<h2
									className="text-xl font-semibold mb-3"
									style={{ color: textColor }}
								>
									Location
								</h2>
								<p style={{ color: textColor }}>
									{event.location}
								</p>
							</div>

							{/* Organizer Info */}
							<div>
								<h2
									className="text-xl font-semibold mb-3"
									style={{ color: textColor }}
								>
									Organizer
								</h2>
								<div className="flex items-center space-x-4">
									<div
										className="h-10 w-10 rounded-full flex items-center justify-center"
										style={{
											backgroundColor: `${accentColor}20`,
										}}
									>
										<span
											className="font-semibold"
											style={{ color: accentColor }}
										>
											{event.owner.name.charAt(0)}
										</span>
									</div>
									<div>
										<p
											className="font-medium"
											style={{ color: textColor }}
										>
											{event.owner.name}
										</p>
										<p style={{ color: textColor }}>
											{event.owner.email}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
