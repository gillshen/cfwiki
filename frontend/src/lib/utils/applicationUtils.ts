import type { ApplicationListItem } from '$lib/api/application';
import { applicationStatusOrder, type ApplicationStatus } from '$lib/api/applicationLog';
import { sortedSchoolNames } from '$lib/api/school';

const _roundOrder: Record<string, number> = {
	ED1: 0,
	REA: 1,
	EA1: 2,
	ED2: 3,
	EA2: 4,
	Priority: 5,
	RD: 6,
	Regular: 6,
	'Round 1': 7,
	'Round 2': 8,
	'Round 3': 9,
	'Round 4': 10,
	'Round 5': 11,
	Rolling: 99
};

export function orderByRoundName(a: ApplicationListItem, b: ApplicationListItem) {
	return (_roundOrder[a.round.name] ?? -1) - (_roundOrder[b.round.name] ?? -1);
}

export function orderByStatus(a: ApplicationListItem, b: ApplicationListItem) {
	const aStatusOrder: number = applicationStatusOrder[a.latest_log?.status ?? ''] ?? -1;
	const bStatusOrder: number = applicationStatusOrder[b.latest_log?.status ?? ''] ?? -1;
	return aStatusOrder - bStatusOrder;
}

export function orderByYearDesc(a: ApplicationListItem, b: ApplicationListItem) {
	return b.program_iteration.year - a.program_iteration.year;
}

export function orderByDueDate(a: ApplicationListItem, b: ApplicationListItem) {
	return (a.round.due_date ?? '').localeCompare(b.round.due_date ?? '');
}

export function orderBySchoolName(a: ApplicationListItem, b: ApplicationListItem) {
	const aNames = sortedSchoolNames(a.schools);
	const bNames = sortedSchoolNames(b.schools);

	// It's known that each application is associated with at most two schools
	if (aNames[0] !== bNames[0]) {
		return aNames[0].localeCompare(bNames[0]);
	} else {
		return (aNames[1] ?? '').localeCompare(bNames[1] ?? '');
	}
}

export function orderByStudentName(a: ApplicationListItem, b: ApplicationListItem) {
	return a.student.fullname.localeCompare(b.student.fullname, 'zh-CN');
}

export function formatMajors(application: ApplicationListItem): string {
	const majors = [application.major_1, application.major_2, application.major_3];
	return majors.filter(Boolean).join(' | ');
}

export function groupByYear(
	applications: ApplicationListItem[]
): Record<string, ApplicationListItem[]> {
	const grouped: Record<string, ApplicationListItem[]> = {};

	for (const appl of applications) {
		const key = appl.program_iteration.year.toString();
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(appl);
	}

	const sortedGroups: Record<string, ApplicationListItem[]> = {};
	const sortedKeys = Object.keys(grouped).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

	for (const key of sortedKeys) {
		// Add a trailing space to prevent JS from reordering the keys
		sortedGroups[`${key} `] = grouped[key];
	}
	return sortedGroups;
}

export function statusToClass(status: ApplicationStatus | undefined): string {
	if (!status) {
		return '';
	} else {
		return status.replace('.', '').replace(/ /, '-').toLowerCase();
	}
}
