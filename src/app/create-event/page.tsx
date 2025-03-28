"use client";

import React from "react";
import CreateEvent from "@/app/components/events/CreateEvent";

export default function CreateEventPage() {
	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Create New Event
					</h1>
					<p className="mt-2 text-lg text-gray-600">
						Fill in the details below to create your event
					</p>
				</div>
				<CreateEvent />
			</div>
		</div>
	);
}
