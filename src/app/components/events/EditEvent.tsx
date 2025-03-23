"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/store/eventStore";
import { EventType, EventFormData } from "@/types/events";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EditEventProps {
	eventId: number;
}

export default function EditEvent({ eventId }: EditEventProps) {
	const router = useRouter();
	const { fetchEvent, updateEvent } = useEventStore();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<EventFormData>({
		id: eventId,
		title: "",
		shortDescription: "",
		description: "",
		location: "",
		image: "",
		startDate: new Date(),
		endDate: undefined,
		startTime: new Date(),
		endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
		isAllDay: false,
		theme: {
			backgroundColor: "#f9fafb",
			textColor: "#1f2937",
			accentColor: "#3b82f6",
			bannerImage: "",
			fontFamily: "sans-serif",
			borderColor: "#e5e7eb",
		},
		status: "draft",
		visibility: "public",
		owner: {
			name: "",
			email: "",
		},
	});

	// Fetch the event data when the component mounts
	useEffect(() => {
		const loadEvent = async () => {
			try {
				const event = await fetchEvent(eventId);
				if (event) {
					// Convert date strings to Date objects
					const startDate = new Date(event.startDate);
					const endDate = event.endDate
						? new Date(event.endDate)
						: undefined;
					const startTime = new Date(startDate);
					const endTime =
						endDate ||
						new Date(startDate.getTime() + 60 * 60 * 1000);

					setFormData({
						...event,
						startDate,
						endDate,
						startTime,
						endTime,
						isAllDay:
							startTime.getHours() === 0 &&
							startTime.getMinutes() === 0,
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Combine date and time for start and end dates
			const startDateTime = new Date(formData.startDate);
			startDateTime.setHours(formData.startTime.getHours());
			startDateTime.setMinutes(formData.startTime.getMinutes());

			const endDateTime = new Date(
				formData.endDate || formData.startDate
			);
			endDateTime.setHours(formData.endTime.getHours());
			endDateTime.setMinutes(formData.endTime.getMinutes());

			// Create a new event without the form-specific fields
			const { startTime, endTime, isAllDay, ...eventData } = formData;
			const updatedEvent = await updateEvent({
				...eventData,
				startDate: startDateTime,
				endDate: endDateTime,
			});

			// Navigate to the updated event's page
			router.push(`/events/${updatedEvent.id}`);
		} catch (error) {
			console.error("Error updating event:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleThemeChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			theme: {
				...prev.theme,
				[name]: value,
			},
		}));
	};

	const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isAllDay = e.target.checked;
		setFormData((prev) => ({
			...prev,
			isAllDay,
			startTime: isAllDay ? new Date(0, 0, 0, 0, 0) : prev.startTime,
			endTime: isAllDay ? new Date(0, 0, 0, 23, 59) : prev.endTime,
		}));
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Information */}
				<div className="bg-white shadow rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						Basic Information
					</h2>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700"
							>
								Event Title
							</label>
							<input
								type="text"
								id="title"
								name="title"
								required
								value={formData.title}
								onChange={handleInputChange}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="shortDescription"
								className="block text-sm font-medium text-gray-700"
							>
								Short Description
							</label>
							<input
								type="text"
								id="shortDescription"
								name="shortDescription"
								required
								value={formData.shortDescription}
								onChange={handleInputChange}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700"
							>
								Full Description
							</label>
							<textarea
								id="description"
								name="description"
								required
								rows={4}
								value={formData.description}
								onChange={handleInputChange}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="location"
								className="block text-sm font-medium text-gray-700"
							>
								Location
							</label>
							<input
								type="text"
								id="location"
								name="location"
								required
								value={formData.location}
								onChange={handleInputChange}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				{/* Date and Time */}
				<div className="bg-white shadow rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						Date and Time
					</h2>
					<div className="space-y-4">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="isAllDay"
								name="isAllDay"
								checked={formData.isAllDay}
								onChange={handleAllDayChange}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="isAllDay"
								className="ml-2 block text-sm text-gray-700"
							>
								All-day event
							</label>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Start Date
								</label>
								<DatePicker
									selected={formData.startDate}
									onChange={(date: Date | null) =>
										setFormData((prev) => ({
											...prev,
											startDate: date || new Date(),
										}))
									}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									dateFormat="MMMM d, yyyy"
									minDate={new Date()}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Start Time
								</label>
								<DatePicker
									selected={formData.startTime}
									onChange={(date: Date | null) =>
										setFormData((prev) => ({
											...prev,
											startTime: date || new Date(),
										}))
									}
									showTimeSelectOnly
									timeIntervals={15}
									timeFormat="HH:mm"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									dateFormat="HH:mm"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									End Time
								</label>
								<DatePicker
									selected={formData.endTime}
									onChange={(date: Date | null) =>
										setFormData((prev) => ({
											...prev,
											endTime: date || new Date(),
										}))
									}
									showTimeSelectOnly
									timeIntervals={15}
									timeFormat="HH:mm"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									dateFormat="HH:mm"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									End Date (Optional)
								</label>
								<DatePicker
									selected={formData.endDate}
									onChange={(date: Date | null) =>
										setFormData((prev) => ({
											...prev,
											endDate: date || undefined,
										}))
									}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									dateFormat="MMMM d, yyyy"
									minDate={formData.startDate}
									placeholderText="Select end date (optional)"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Theme Settings */}
				<div className="bg-white shadow rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						Theme Settings
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="backgroundColor"
								className="block text-sm font-medium text-gray-700"
							>
								Background Color
							</label>
							<input
								type="color"
								id="backgroundColor"
								name="backgroundColor"
								value={formData.theme?.backgroundColor}
								onChange={handleThemeChange}
								className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="textColor"
								className="block text-sm font-medium text-gray-700"
							>
								Text Color
							</label>
							<input
								type="color"
								id="textColor"
								name="textColor"
								value={formData.theme?.textColor}
								onChange={handleThemeChange}
								className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="accentColor"
								className="block text-sm font-medium text-gray-700"
							>
								Accent Color
							</label>
							<input
								type="color"
								id="accentColor"
								name="accentColor"
								value={formData.theme?.accentColor}
								onChange={handleThemeChange}
								className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="borderColor"
								className="block text-sm font-medium text-gray-700"
							>
								Border Color
							</label>
							<input
								type="color"
								id="borderColor"
								name="borderColor"
								value={formData.theme?.borderColor}
								onChange={handleThemeChange}
								className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div className="md:col-span-2">
							<label
								htmlFor="bannerImage"
								className="block text-sm font-medium text-gray-700"
							>
								Banner Image URL
							</label>
							<input
								type="url"
								id="bannerImage"
								name="bannerImage"
								value={formData.theme?.bannerImage}
								onChange={handleThemeChange}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<div className="md:col-span-2">
							<label
								htmlFor="fontFamily"
								className="block text-sm font-medium text-gray-700"
							>
								Font Family
							</label>
							<select
								id="fontFamily"
								name="fontFamily"
								value={formData.theme?.fontFamily}
								onChange={handleThemeChange}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							>
								<option value="sans-serif">Sans Serif</option>
								<option value="serif">Serif</option>
								<option value="monospace">Monospace</option>
							</select>
						</div>
					</div>
				</div>

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => router.push(`/events/${eventId}`)}
						className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
					>
						{isSubmitting ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</form>
		</div>
	);
}
