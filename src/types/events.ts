export interface EventType {
	id?: number; // Autoincremented primary key from the DB
	uuid?: string; // External identifier (remains the same across versions)
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

	// Attendees for the event come from the join table (if needed)
	attendees?: EventAttendee[];

	notifyAttendees?: boolean;

	status: "draft" | "published" | "cancelled";
	visibility: "public" | "private";

	signupOptions?: {
		openForSignup: boolean;
		deadline?: string;
	};

	theme?: Partial<EventTheme>;

	owner: User;
	editors?: User[];
}

// Form-specific interface that extends EventType
export interface EventFormData
	extends Omit<EventType, "startDate" | "endDate"> {
	startDate: Date;
	endDate?: Date;
	startTime: Date;
	endTime: Date;
	isAllDay: boolean;
}

export interface User {
	id?: number;
	name: string;
	email: string;
}

export interface EventAttendee {
	eventId: number;
	userId: number;
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
	changedBy: User;
	changedAt: Date;
	changes: Change[];
}

export interface Change {
	field: string;
	oldValue: string | number | boolean | null | object;
	newValue: string | number | boolean | null | object;
}
