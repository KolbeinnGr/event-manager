"use client";

import React, { useState } from "react";
import { EventType, RecurringDetails, Weekday } from "@/types/events";
import { useRouter } from "next/navigation";

// Helper function to format a Date object for the datetime-local input
function formatDateForInput(date?: Date): string {
	if (!date) return "";
	return date.toISOString().slice(0, 16);
}

export default function CreateEventPage() {
	const router = useRouter();
	const [event, setEvent] = useState<EventType>({
		image: "",
		shortDescription: "",
		title: "",
		description: "",
		location: "",
		startDate: new Date(),
		endDate: new Date(),
		recurring: false,
		attendees: [],
		notifyAttendees: false,
		status: "draft",
		visibility: "public",
		signupOptions: {
			openForSignup: false,
			deadline: "",
		},
		theme: {
			backgroundColor: "#ffffff",
			textColor: "#000000",
			accentColor: "#3b82f6",
			fontFamily: "Inter",
		},
		owner: {
			name: "",
			email: "",
		},
	});

	const [recurringDetails, setRecurringDetails] = useState<RecurringDetails>({
		type: "daily",
		interval: 1,
		startDate: new Date(),
	});

	const handleChange = (updatedEvent: Partial<EventType>) => {
		setEvent((prev) => ({ ...prev, ...updatedEvent }));
	};

	const handleRecurringChange = (details: Partial<RecurringDetails>) => {
		setRecurringDetails((prev) => ({ ...prev, ...details }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const eventData = {
			...event,
			startDate: event.startDate.toISOString(),
			endDate: event.endDate ? event.endDate.toISOString() : null,
			recurringDetails: event.recurring ? recurringDetails : undefined,
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
				// Redirect to the events page
				router.push("/events");
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="bg-white shadow rounded-lg p-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-6">
						Create New Event
					</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Basic Information Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-medium text-gray-900">
								Basic Information
							</h2>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Title
								</label>
								<input
									type="text"
									value={event.title}
									onChange={(e) =>
										handleChange({ title: e.target.value })
									}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Short Description
								</label>
								<input
									type="text"
									value={event.shortDescription}
									onChange={(e) =>
										handleChange({
											shortDescription: e.target.value,
										})
									}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Description
								</label>
								<textarea
									value={event.description}
									onChange={(e) =>
										handleChange({
											description: e.target.value,
										})
									}
									rows={4}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Location
								</label>
								<input
									type="text"
									value={event.location}
									onChange={(e) =>
										handleChange({
											location: e.target.value,
										})
									}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									required
								/>
							</div>
						</div>

						{/* Date and Time Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-medium text-gray-900">
								Date and Time
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Start Date & Time
									</label>
									<input
										type="datetime-local"
										value={formatDateForInput(
											event.startDate
										)}
										onChange={(e) =>
											handleChange({
												startDate: new Date(
													e.target.value
												),
											})
										}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										End Date & Time
									</label>
									<input
										type="datetime-local"
										value={formatDateForInput(
											event.endDate
										)}
										onChange={(e) =>
											handleChange({
												endDate: new Date(
													e.target.value
												),
											})
										}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>

						{/* Recurring Event Section */}
						<div className="space-y-4">
							<div className="flex items-center">
								<input
									type="checkbox"
									checked={event.recurring}
									onChange={(e) =>
										handleChange({
											recurring: e.target.checked,
										})
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label className="ml-2 block text-sm text-gray-900">
									Recurring Event
								</label>
							</div>

							{event.recurring && (
								<div className="space-y-4 pl-6">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Recurrence Type
										</label>
										<select
											value={recurringDetails.type}
											onChange={(e) =>
												handleRecurringChange({
													type: e.target
														.value as RecurringDetails["type"],
												})
											}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										>
											<option value="daily">Daily</option>
											<option value="weekly">
												Weekly
											</option>
											<option value="monthly">
												Monthly
											</option>
											<option value="yearly">
												Yearly
											</option>
											<option value="custom">
												Custom
											</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700">
											Interval
										</label>
										<input
											type="number"
											min="1"
											value={recurringDetails.interval}
											onChange={(e) =>
												handleRecurringChange({
													interval: parseInt(
														e.target.value
													),
												})
											}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>
								</div>
							)}
						</div>

						{/* Signup Options Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-medium text-gray-900">
								Signup Options
							</h2>

							<div className="flex items-center">
								<input
									type="checkbox"
									checked={event.signupOptions?.openForSignup}
									onChange={(e) =>
										handleChange({
											signupOptions: {
												openForSignup: e.target.checked,
												deadline:
													event.signupOptions
														?.deadline,
											},
										})
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label className="ml-2 block text-sm text-gray-900">
									Open for Signup
								</label>
							</div>

							{event.signupOptions?.openForSignup && (
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Signup Deadline
									</label>
									<input
										type="datetime-local"
										value={event.signupOptions.deadline}
										onChange={(e) =>
											handleChange({
												signupOptions: {
													openForSignup: true,
													deadline: e.target.value,
												},
											})
										}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>
							)}
						</div>

						{/* Theme Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-medium text-gray-900">
								Theme
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Background Color
									</label>
									<input
										type="color"
										value={event.theme?.backgroundColor}
										onChange={(e) =>
											handleChange({
												theme: {
													...event.theme,
													backgroundColor:
														e.target.value,
												},
											})
										}
										className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Text Color
									</label>
									<input
										type="color"
										value={event.theme?.textColor}
										onChange={(e) =>
											handleChange({
												theme: {
													...event.theme,
													textColor: e.target.value,
												},
											})
										}
										className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Accent Color
									</label>
									<input
										type="color"
										value={event.theme?.accentColor}
										onChange={(e) =>
											handleChange({
												theme: {
													...event.theme,
													accentColor: e.target.value,
												},
											})
										}
										className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
									/>
								</div>
							</div>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end">
							<button
								type="submit"
								className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Create Event
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
