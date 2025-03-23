"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/store/eventStore";
import { EventType } from "@/types/events";

interface ViewEventProps {
	eventId: number;
}

export default function ViewEvent({ eventId }: ViewEventProps) {
	const router = useRouter();
	const { fetchEvent } = useEventStore();
	const [event, setEvent] = useState<EventType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadEvent = async () => {
			try {
				const fetchedEvent = await fetchEvent(eventId);
				if (fetchedEvent) {
					// Convert date strings to Date objects
					const startDate = new Date(fetchedEvent.startDate);
					const endDate = fetchedEvent.endDate
						? new Date(fetchedEvent.endDate)
						: undefined;
					setEvent({
						...fetchedEvent,
						startDate,
						endDate,
					});
				}
			} catch (error) {
				console.error("Error loading event:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadEvent();
	}, [eventId, fetchEvent]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!event) {
		return (
			<div className="text-center py-12">
				<h2 className="text-2xl font-semibold text-gray-900">
					Event not found
				</h2>
				<p className="mt-2 text-gray-600">
					The event you're looking for doesn't exist or has been
					removed.
				</p>
				<button
					onClick={() => router.push("/events")}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					View All Events
				</button>
			</div>
		);
	}

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	const isMultiDay =
		event.endDate && event.endDate.getDate() !== event.startDate.getDate();

	return (
		<div
			className="max-w-4xl mx-auto p-4"
			style={{
				color: event.theme?.textColor,
				fontFamily: event.theme?.fontFamily,
			}}
		>
			{/* Header */}
			<div
				className="shadow rounded-lg overflow-hidden bg-white"
				style={{
					borderColor: event.theme?.borderColor,
					borderWidth: "1px",
				}}
			>
				{event.theme?.bannerImage && (
					<div
						className="h-48 bg-cover bg-center"
						style={{
							backgroundImage: `url(${event.theme.bannerImage})`,
						}}
					/>
				)}
				<div className="px-6 py-8">
					<h1
						className="text-3xl font-bold mb-4"
						style={{ color: event.theme?.textColor }}
					>
						{event.title}
					</h1>
					<p
						className="text-xl"
						style={{ color: event.theme?.textColor }}
					>
						{event.shortDescription}
					</p>
				</div>
			</div>

			{/* Date and Time */}
			<div
				className="mt-6 shadow rounded-lg p-6 bg-white"
				style={{
					borderColor: event.theme?.borderColor,
					borderWidth: "1px",
				}}
			>
				<h2
					className="text-xl font-semibold mb-4"
					style={{ color: event.theme?.textColor }}
				>
					Date and Time
				</h2>
				<div className="space-y-4">
					<div className="flex items-start">
						<div className="flex-shrink-0">
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								style={{ color: event.theme?.accentColor }}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<p
								className="text-sm font-medium"
								style={{ color: event.theme?.textColor }}
							>
								Start
							</p>
							<p
								className="text-sm"
								style={{ color: event.theme?.textColor }}
							>
								{formatDate(event.startDate)}
							</p>
							<p
								className="text-sm"
								style={{ color: event.theme?.textColor }}
							>
								{formatTime(event.startDate)}
							</p>
						</div>
					</div>

					{isMultiDay && (
						<div className="flex items-start">
							<div className="flex-shrink-0">
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									style={{ color: event.theme?.accentColor }}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p
									className="text-sm font-medium"
									style={{ color: event.theme?.textColor }}
								>
									End
								</p>
								<p
									className="text-sm"
									style={{ color: event.theme?.textColor }}
								>
									{formatDate(event.endDate!)}
								</p>
								<p
									className="text-sm"
									style={{ color: event.theme?.textColor }}
								>
									{formatTime(event.endDate!)}
								</p>
							</div>
						</div>
					)}

					{!isMultiDay && event.endDate && (
						<div className="flex items-start">
							<div className="flex-shrink-0">
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									style={{ color: event.theme?.accentColor }}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p
									className="text-sm font-medium"
									style={{ color: event.theme?.textColor }}
								>
									End Time
								</p>
								<p
									className="text-sm"
									style={{ color: event.theme?.textColor }}
								>
									{formatTime(event.endDate)}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Location */}
			<div
				className="mt-6 shadow rounded-lg p-6 bg-white"
				style={{
					borderColor: event.theme?.borderColor,
					borderWidth: "1px",
				}}
			>
				<h2
					className="text-xl font-semibold mb-4"
					style={{ color: event.theme?.textColor }}
				>
					Location
				</h2>
				<div className="flex items-start">
					<div className="flex-shrink-0">
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							style={{ color: event.theme?.accentColor }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div className="ml-3">
						<p
							className="text-sm"
							style={{ color: event.theme?.textColor }}
						>
							{event.location}
						</p>
					</div>
				</div>
			</div>

			{/* Description */}
			<div
				className="mt-6 shadow rounded-lg p-6 bg-white"
				style={{
					borderColor: event.theme?.borderColor,
					borderWidth: "1px",
				}}
			>
				<h2
					className="text-xl font-semibold mb-4"
					style={{ color: event.theme?.textColor }}
				>
					Description
				</h2>
				<div className="prose max-w-none">
					<p
						className="whitespace-pre-wrap"
						style={{ color: event.theme?.textColor }}
					>
						{event.description}
					</p>
				</div>
			</div>

			{/* Actions */}
			<div className="mt-6 flex justify-end space-x-4">
				<button
					onClick={() => router.push(`/events/${eventId}/edit`)}
					className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					style={{
						borderColor: event.theme?.borderColor,
						color: event.theme?.textColor,
					}}
				>
					Edit Event
				</button>
				<button
					onClick={() => router.push("/events")}
					className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					style={{
						backgroundColor: event.theme?.accentColor,
					}}
				>
					View All Events
				</button>
			</div>
		</div>
	);
}
