import { EventType } from "@/types/events";
import { useState } from "react";

export default function CreateEvent({
	event,
	onSubmit,
	onChange,
}: {
	event: EventType;
	onSubmit: (event: EventType) => void;
	onChange: (event: EventType) => void;
}) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(event);
			}}
		>
			<label>
				Title:
				<input
					type="text"
					value={event.title}
					onChange={(e) =>
						onChange({ ...event, title: e.target.value })
					}
				/>
			</label>
			<label>
				Description:
				<textarea
					value={event.description}
					onChange={(e) =>
						onChange({ ...event, description: e.target.value })
					}
				/>
			</label>
			<label>
				Location:
				<input
					type="text"
					value={event.location}
					onChange={(e) =>
						onChange({ ...event, location: e.target.value })
					}
				/>
			</label>
			<label>
				Start Date:
				<input
					type="datetime-local"
					value={event.startDate}
					onChange={(e) =>
						onChange({ ...event, startDate: e.target.value })
					}
				/>
			</label>
			<label>
				End Date:
				<input
					type="datetime-local"
					value={event.endDate}
					onChange={(e) =>
						onChange({ ...event, endDate: e.target.value })
					}
				/>
			</label>
			<button type="submit">Save</button>
		</form>
	);
}
