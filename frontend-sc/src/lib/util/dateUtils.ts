import { format, parseISO, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { format as formatWithTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

export { parseISO };

type FormatterParams = {
	full: string;
	start?: string;
	sameMonthEnd?: string;
	sameMonthFormatter?: (start: Date, end: Date) => string;
};

class DateRangeFormatter {
	full: string;
	start: string;
	sameMonthEnd: string;
	sameMonthFormatter: ((start: Date, end: Date) => string) | undefined;

	constructor(params: FormatterParams) {
		this.full = params.full;
		this.start = params.start ?? params.full;
		this.sameMonthEnd = params.sameMonthEnd ?? params.full;
		this.sameMonthFormatter = params.sameMonthFormatter;
	}

	format(startDate: Date, endDate: Date): string {
		const sameYear = isSameYear(startDate, endDate);
		const sameMonth = isSameMonth(startDate, endDate);
		const sameDay = isSameDay(startDate, endDate);

		if (sameYear && sameMonth && sameDay) {
			return format(startDate, this.full);
		} else if (sameYear && sameMonth && this.sameMonthFormatter) {
			return this.sameMonthFormatter(startDate, endDate);
		} else if (sameYear && sameMonth) {
			return `${format(startDate, this.start)} \u2013 ${format(endDate, this.sameMonthEnd)}`;
		} else if (sameYear) {
			return `${format(startDate, this.start)} \u2013 ${format(endDate, this.full)}`;
		} else {
			return `${format(startDate, this.full)} \u2013 ${format(endDate, this.full)}`;
		}
	}
}

const toFormattedDate = (params: {
	start: string | null | undefined;
	end?: string | null | undefined;
	formatters: FormatterParams;
}): string => {
	const { start, end, formatters } = params;

	if (!start) return '';

	if (!end) {
		return format(start, formatters.full);
	}

	const startDate = parseISO(start);
	const endDate = parseISO(end);
	const dateRangeFormatter = new DateRangeFormatter(formatters);
	return dateRangeFormatter.format(startDate, endDate);
};

export const toLongDate = (
	start: string | null | undefined,
	end?: string | null | undefined
): string => {
	return toFormattedDate({
		start,
		end,
		formatters: { full: 'MMMM d, y', start: 'MMMM d', sameMonthEnd: 'd, y' }
	});
};

export const toShortDate = (
	start: string | null | undefined,
	end?: string | null | undefined
): string => {
	return toFormattedDate({
		start,
		end,
		formatters: { full: 'MMM d, y', start: 'MMM d', sameMonthEnd: 'd, y' }
	});
};

export const toShortYearMonth = (
	start: string | null | undefined,
	end?: string | null | undefined
): string => {
	return toFormattedDate({
		start,
		end,
		formatters: { full: 'MMM y', sameMonthFormatter: (start) => `${format(start, 'MMM y')}` }
	});
};

export function toISODate(input: string | null | undefined): string {
	return toFormattedDate({ start: input, formatters: { full: 'y-LL-dd' } });
}

export function toISOYearMonth(input: string | null | undefined): string {
	return toFormattedDate({ start: input, formatters: { full: 'y-LL' } });
}

export function activeYears(lookAhead = 5): number[] {
	const startYear = 2022;
	const currentYear = new Date().getFullYear();
	const endYear = currentYear + lookAhead;
	return Array.from({ length: endYear - startYear }, (_, k) => k + startYear);
}

export function quickAccessYears(): number[] {
	const today = new Date();
	const currentYear = today.getFullYear();
	if (today.getMonth() > 2) {
		// Show next year's students starting March
		return [currentYear + 1, currentYear, currentYear - 1, currentYear - 2];
	} else {
		return [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
	}
}

export function formatDueDateTime(
	dateInput: string | null,
	timeInput: string | null,
	timeZone: string
): string {
	if (!dateInput) {
		return '';
	}

	if (!timeInput) {
		return toLongDate(dateInput);
	}

	const date = new Date(`${dateInput}T${timeInput}`);

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

export function yearIsRelevant(applicationYear: number): boolean {
	const today = new Date();
	const currentYear = today.getFullYear();

	// 2024, for example, is no longer relevant past May 2025
	return applicationYear > currentYear || (applicationYear === currentYear && today.getMonth() < 5);
}

export function timestamp(): string {
	return format(new Date(), 'y-LL-dd_HHmmss');
}
