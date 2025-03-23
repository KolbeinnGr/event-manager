"use client";

import React from "react";
import { usePathname } from "next/navigation";
import EditEvent from "@/app/components/events/EditEvent";

export default function EditEventPage() {
	const pathname = usePathname();
	const id = parseInt(pathname.split("/")[2], 10); // Get the event ID from the URL

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Edit Event
					</h1>
					<p className="mt-2 text-lg text-gray-600">
						Update your event details below
					</p>
				</div>
				<EditEvent eventId={id} />
			</div>
		</div>
	);
}
