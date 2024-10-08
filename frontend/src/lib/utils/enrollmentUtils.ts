import type { StudentEnrollmentItem } from '$lib/api/student';

export function formatEnrollments(enrollments: StudentEnrollmentItem[]): string {
	return enrollments.map((e) => formatEnrollment(e)).join('; ');
}

export function formatEnrollment(e: StudentEnrollmentItem): string {
	const dash = '\u2013';
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
