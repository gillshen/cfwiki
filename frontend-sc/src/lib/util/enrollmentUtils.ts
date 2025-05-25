import type { EnrollmentListItem, EnrollmentByStudent } from '$lib/api/enrollment';
import type { StudentEnrollmentItem } from '$lib/api/student';
import { formatGrade } from '$lib/util/gradeUtils';

export function formatEnrollments(enrollments: StudentEnrollmentItem[]): string {
	return enrollments.map((e) => formatEnrollment(e)).join('; ');
}

export function formatEnrollment(e: StudentEnrollmentItem): string {
	const dash = ' \u2013 '; // en dash surrounded by space
	let progression: string;

	const startProgression = formatProgression(e.start_progression);

	if (e.start_progression == e.end_progression) {
		progression = startProgression;
	} else if (e.start_progression.startsWith('G') && e.end_progression.startsWith('G')) {
		progression = `${startProgression}${dash}${e.end_progression.slice(1)}`;
	} else if (e.start_progression.startsWith('Year ') && e.end_progression.startsWith('Year ')) {
		progression = `${startProgression}${dash}${e.end_progression.slice(5)}`;
	} else {
		progression = `${startProgression}${dash}${formatProgression(e.end_progression) || 'Present'}`;
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
		e.start_progression ? `(${formatProgression(e.start_progression)})` : '',
		'\u2013', // n dash
		dateFormatter(e.end_date) || 'Present',
		e.end_progression ? `(${formatProgression(e.end_progression)})` : ''
	]
		.filter(Boolean)
		.join(' ');
}

export const formatProgression = (progression: string): string => {
	// replace 'Year ' with 'Yr ' and "Gxx" with "G-xx" for better readability
	return progression.replace('Year ', 'Yr ').replace(/G(\d+)/, 'G-$1');
};

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
