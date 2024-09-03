import type {
	ApplicantListItem,
	ApplicationListItem,
	ComposedApplicationListItem,
	ApplicationType
} from '$lib/api/application';

import { applicationStatusOrder, type ApplicationStatus } from '$lib/api/applicationLog';
import { sortedSchoolNames } from '$lib/api/school';
import { orderByRoundName as _orderByRoundName } from '$lib/utils/applicationRoundUtils';
import { lexicalChineseLast } from '$lib/utils/stringUtils';

export function compose(
	applications: ApplicationListItem[],
	applicants: ApplicantListItem[]
): ComposedApplicationListItem[] {
	return applications.map((application) => {
		const student = applicants.find((a) => a.id === application.student.id)!;
		return { ...application, student };
	});
}

const _typeOrdering: Record<string, number> = {
	'UG Freshman': 0,
	'UG Transfer': 1,
	"Master's": 2,
	Doctorate: 2,
	Graduate: 2,
	'Non-degree': 3
};

export function formatApplicationType(applicationType: ApplicationType | string): string {
	switch (applicationType) {
		case 'freshman':
			return 'UG Freshman';
		case 'transfer':
			return 'UG Transfer';
		case 'graduate':
			return 'Graduate';
		case 'other':
			return 'Other';
		default:
			return applicationType;
	}
}

export function orderByRoundName(a: ApplicationListItem, b: ApplicationListItem) {
	return _orderByRoundName(a.round_name, b.round_name);
}

export function orderByStatus(a: ApplicationListItem, b: ApplicationListItem) {
	const aStatusOrder: number = applicationStatusOrder[a.latest_log?.status ?? ''] ?? -1;
	const bStatusOrder: number = applicationStatusOrder[b.latest_log?.status ?? ''] ?? -1;
	return aStatusOrder - bStatusOrder;
}

export function orderByType(a: ApplicationListItem, b: ApplicationListItem) {
	return _typeOrdering[a.program.type] - _typeOrdering[b.program.type];
}

export function orderByYearDesc(a: ApplicationListItem, b: ApplicationListItem) {
	return b.year - a.year;
}

export function orderByDueDate(a: ApplicationListItem, b: ApplicationListItem) {
	return (a.due_date ?? '').localeCompare(b.due_date ?? '');
}

export function orderBySchoolName(a: ApplicationListItem, b: ApplicationListItem) {
	const aNames = sortedSchoolNames(a.schools);
	const bNames = sortedSchoolNames(b.schools);

	// since each application is associated with at most two schools
	if (aNames[0] !== bNames[0]) {
		return lexicalChineseLast(aNames[0], bNames[0]);
	} else {
		return lexicalChineseLast(aNames[1] ?? '', bNames[0] ?? '');
	}
}

export function orderByStudentName(a: ComposedApplicationListItem, b: ComposedApplicationListItem) {
	return a.student.fullname.localeCompare(b.student.fullname, 'zh-CN');
}

export function groupByYear(
	applications: ComposedApplicationListItem[]
): Record<string, ComposedApplicationListItem[]> {
	const grouped: Record<string, ComposedApplicationListItem[]> = {};

	for (const appl of applications) {
		const key = appl.year.toString();
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(appl);
	}

	const sortedGroups: Record<string, ComposedApplicationListItem[]> = {};
	const sortedKeys = Object.keys(grouped).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

	for (const key of sortedKeys) {
		// Add a trailing space to prevent JS from reordering the keys
		sortedGroups[`${key} `] = grouped[key];
	}
	return sortedGroups;
}

export function groupByType(
	applications: ApplicationListItem[]
): Record<string, ApplicationListItem[]> {
	const grouped: Record<string, ApplicationListItem[]> = {};

	for (const appl of applications) {
		let key = appl.program.type;
		if (key === "Master's" || key === 'Doctorate') {
			key = 'Graduate';
		}
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(appl);
	}

	const sortedGroups: Record<string, ApplicationListItem[]> = {};
	const sortedKeys = Object.keys(grouped).sort((a, b) => _typeOrdering[a] - _typeOrdering[b]);

	for (const key of sortedKeys) {
		sortedGroups[key] = grouped[key];
	}
	return sortedGroups;
}

export function statusToClass(status: ApplicationStatus | null | undefined): string {
	if (!status) {
		return '';
	} else {
		return status.replace('.', '').replace(/ /, '-').toLowerCase();
	}
}
