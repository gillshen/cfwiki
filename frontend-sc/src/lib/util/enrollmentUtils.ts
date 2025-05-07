import type { EnrollmentListItem, EnrollmentByStudent } from '$lib/api/enrollment';
import type { StudentEnrollmentItem } from '$lib/api/student';
import { formatGrade } from '$lib/util/gradeUtils';

export function formatEnrollments(enrollments: StudentEnrollmentItem[]): string {
	return enrollments.map((e) => formatEnrollment(e)).join('; ');
}

export function formatEnrollment(e: StudentEnrollmentItem): string {
	const dash = '\u2013'; // n dash
	let progression: string;

	if (e.start_progression == e.end_progression) {
		progression = e.start_progression;
	} else if (e.start_progression.startsWith('G') && e.end_progression.startsWith('G')) {
		progression = `${e.start_progression}${dash}${e.end_progression.slice(1)}`;
	} else if (e.start_progression.startsWith('Year ') && e.end_progression.startsWith('Year ')) {
		progression = `${e.start_progression}${dash}${e.end_progression.slice(5)}`;
	} else {
		progression = `${e.start_progression}${dash}${e.end_progression || 'Now'}`;
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

export function orderByDatesDesc(
	a: { start_date: string; end_date: string | null },
	b: { start_date: string; end_date: string | null }
): number {
	const endDateA = a.end_date ?? '9999-12-31';
	const endDateB = b.end_date ?? '9999-12-31';

	// if identical end dates, order by start date desc
	if (endDateA === endDateB) {
		return b.start_date.localeCompare(a.start_date);
	}
	return endDateB.localeCompare(endDateA);
}

export const formatGradeOfProgression = ({
	enrollment,
	progression,
	precision = 3
}: {
	enrollment: StudentEnrollmentItem;
	progression: string;
	precision?: number;
}): string | undefined => {
	const grades = enrollment.grades.filter((grade) => grade.progression === progression);

	if (!grades.length) {
		return undefined;
	}
	// grades always come sorted from the backend
	const lastGrade = grades[grades.length - 1];
	return formatGrade(lastGrade, precision);
};
