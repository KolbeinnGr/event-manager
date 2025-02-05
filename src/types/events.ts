export interface Event {
	id: string;
	title: string; // Event title, used in the event list view and emails
	image: string;
	shortDescription: string; // Short description for the event list view and subject line for emails
	description: string;
	startDate: string; // Event start date and time in ISO8601 format (e.g., "2022-12-31T23:59:59Z")
	endDate?: string; // Event end date and time in ISO8601 format, not required
	location: string; // Physical or virtual location

	// Recurring setup
	recurring?: boolean; // Is this a recurring event?
	recurringDetails?: RecurringDetails;

	attendees?: Attendee[]; // List of attendees
	notifyAttendees?: boolean; // Should attendees be notified of changes?

	status: "draft" | "published" | "cancelled"; // Event status
	visibility: "public" | "private"; // Event visibility
	openForSignup: boolean; // Is the event open for signups?
	attendeeSignupDeadline: string; // Deadline for attendees to sign up in ISO8601 format

	signupOptions?: {
		openForSignup: boolean;
		deadline?: string; // ISO8601 format
	};

	theme?: EventTheme; // Custom theme for the event

	owner: Attendee; // Event owner, who can publish or cancel the event
	editors?: Attendee[]; // List of attendees who can edit the event

	createdAt: string;
	updatedAt: string;
	changeHistory?: ChangeHistory[]; // Array of change records
}

export interface Attendee {
	id: string;
	name: string;
	email: string;
}

// Recurring event details interface
export interface RecurringDetails {
	type: "daily" | "weekly" | "monthly" | "yearly"; // Recurrence frequency
	interval: number; // Interval between occurrences (e.g., every 2 weeks)
	daysOfWeek?: Weekday[]; // Specific days of the week for "weekly" recurrence
	dayOfMonth?: number; // Specific day of the month for "monthly" recurrence
	weekOfMonth?: number; // Week of the month (1st, 2nd, etc.) for "monthly" recurrence
	monthOfYear?: number; // Month of the year (1–12) for "yearly" recurrence
	startDate: string; // Recurrence start date in ISO8601 format, required for recurring events
	endDate?: string; // Recurrence end date in ISO8601 format
}

// Enum for days of the week
export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface EventTheme {
	backgroundColor?: string; // Background color (e.g., "#FFFFFF" or "rgb(255, 255, 255)")
	textColor?: string; // Text color for the event (e.g., "#000000")
	accentColor?: string; // Accent color (e.g., for buttons, links, etc.)
	bannerImage?: string; // URL of a banner image for the event
	fontFamily?: string; // Custom font for the event (e.g., "Arial, sans-serif")
	borderColor?: string; // Border color for card or sections
}
export interface ChangeHistory {
	id: string; // Unique ID for the change record
	eventId: string; // The event that was changed
	changedBy: Attendee; // User who made the change
	changedAt: string; // ISO8601 timestamp for when the change occurred
	changes: Change[]; // Array of individual field changes
}

export interface Change {
	field: string; // Name of the field that was changed
	oldValue: string | number | boolean | null; // Old value of the field
	newValue: string | number | boolean | null; // New value of the field
}
