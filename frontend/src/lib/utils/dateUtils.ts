import { format } from 'date-fns';
import { format as formatWithTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

export function makeDate(dateString: string | null | undefined): Date | null {
	if (!dateString) {
		return null;
	}
	const date = new Date(dateString);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
}

function toFormattedDate(dateString: string | null | undefined, formatter: string): string {
	if (!dateString) {
		return '';
	}
	return format(makeDate(dateString) as Date, formatter);
}

export function toLongDate(dateString: string | null | undefined): string {
	return toFormattedDate(dateString, 'MMMM d, y');
}

export function toShortDate(dateString: string | null | undefined): string {
	return toFormattedDate(dateString, 'MMM d, y');
}

export function toISODate(dateString: string | null | undefined): string {
	return toFormattedDate(dateString, 'y-LL-dd');
}

export function activeYears(lookAhead = 5): number[] {
	const startYear = 2020;
	const currentYear = new Date().getFullYear();
	const endYear = currentYear + lookAhead;
	return Array.from({ length: endYear - startYear }, (_, k) => k + startYear);
}

export function quickAccessYears(): number[] {
	const today = new Date();
	const currentYear = today.getFullYear();
	if (today.getMonth() > 4) {
		return [currentYear + 1, currentYear, currentYear - 1];
	} else {
		return [currentYear, currentYear - 1, currentYear - 2];
	}
}

export function formatDueDateTime(
	dateString: string | null,
	timeString: string | null,
	timeZone: string
): string {
	if (!dateString) {
		return '';
	}

	if (!timeString) {
		return toLongDate(dateString);
	}

	const date = new Date(`${dateString}T${timeString}`);

	if (!timeZone) {
		return format(date, "MMMM d, y 'at' hh:mm a");
	}

	if (timeZone.toLowerCase() === 'applicant') {
		return format(date, "MMMM d, y 'at' hh:mm a '(applicant''s time)'");
	}

	// Format the date in the specified time zone
	const utcDate = fromZonedTime(date, timeZone);
	const zonedDate = toZonedTime(utcDate, timeZone);
	return formatWithTimeZone(zonedDate, "MMMM d, y 'at' hh:mm aa z", { timeZone });
}
