export interface Event {
	id: number; // Autoincremented primary key (Int)
	uuid: string; // External identifier that remains constant across versions
	title: string;
	image: string;
	shortDescription: string;
	description: string;
	startDate: Date;
	endDate?: Date;
	location: string;

	// Recurring setup
	recurring?: boolean;
	recurringDetails?: RecurringDetails;

	// Note: Attendees for the event come from the join table (EventAttendee)
	// You may optionally include a helper field:
	attendees?: EventAttendee[];

	notifyAttendees?: boolean;

	status: "draft" | "published" | "cancelled";
	visibility: "public" | "private";

	signupOptions?: {
		openForSignup: boolean;
		deadline?: string;
	};

	theme?: Partial<EventTheme>;

	owner: Attendee;
	editors?: Attendee[];

	createdAt: Date;
	updatedAt: Date;
	changeHistory?: ChangeHistory[];
}

export interface Attendee {
	id: number; // Updated to number
	name: string;
	email: string;
}

export interface EventAttendee {
	eventId: number;
	attendeeId: number;
	role: "owner" | "editor" | "attendee";
}

export interface RecurringDetails {
	type: "daily" | "weekly" | "monthly" | "yearly" | "custom";
	interval?: number;
	daysOfWeek?: Weekday[];
	dayOfMonth?: number;
	weekOfMonth?: number;
	monthOfYear?: number;
	startDate: Date;
	endDate?: Date;
	customDates?: string[];
}

export type Weekday =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export interface EventTheme {
	backgroundColor?: string;
	textColor?: string;
	accentColor?: string;
	bannerImage?: string;
	fontFamily?: string;
	borderColor?: string;
}

export interface ChangeHistory {
	id: number;
	eventId: number;
	changedBy: Attendee;
	changedAt: Date;
	changes: Change[];
}

export interface Change {
	field: string;
	oldValue: string | number | boolean | null | object;
	newValue: string | number | boolean | null | object;
}
