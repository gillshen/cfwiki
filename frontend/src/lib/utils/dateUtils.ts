import { format } from 'date-fns';

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
