import type { EnrollmentListItem, EnrollmentByStudent } from '$lib/api/enrollment';
import type { StudentEnrollmentItem } from '$lib/api/student';

export function formatEnrollments(enrollments: StudentEnrollmentItem[]): string {
	return enrollments.map((e) => formatEnrollment(e)).join('; ');
}

export function formatEnrollment(e: StudentEnrollmentItem): string {
	const dash = '\u2013'; // n dash
	let progression: string;

	if (e.start_progression == e.end_progression) {
		progression = e.start_progression;
	} else if (e.start_progression.startsWith('G') && e.end_progression.startsWith('G')) {
		progression = `${e.start_progression} ${dash} ${e.end_progression.slice(1)}`;
	} else if (e.start_progression.startsWith('Year ') && e.end_progression.startsWith('Year ')) {
		progression = `${e.start_progression} ${dash} ${e.end_progression.slice(5)}`;
	} else {
		progression = `${e.start_progression} ${dash} ${e.end_progression || 'Now'}`;
	}

	const extra = [progression, e.curriculum].filter(Boolean).join(', ');
	return e.school_name + (extra ? ` (${extra})` : '');
}

export function formatEnrollmentDates(
	e: EnrollmentListItem | EnrollmentByStudent,
	dateFormatter: (dateString: string | null | undefined) => string
): string {
	return [
		dateFormatter(e.start_date),
		e.start_progression ? `(${e.start_progression})` : '',
		'\u2013', // n dash
		dateFormatter(e.end_date) || '?',
		e.end_progression ? `(${e.end_progression})` : ''
	]
		.filter(Boolean)
		.join(' ');
}

export function orderByDatesDesc(a: EnrollmentListItem, b: EnrollmentListItem): number {
	if (a.end_date === b.end_date) {
		return b.start_date.localeCompare(a.start_date);
	}
	// put the item with a non-null end date first
	return a.end_date === null ? 1 : -1;
}
