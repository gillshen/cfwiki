import type { ComposedApplication, ApplicationType } from '$lib/api/application';
import type { ProgramType } from '$lib/api/program';

import {
	applicationStatusOrder,
	type ApplicationStatus,
	type ApplicationLogBrief,
	type ApplicationStatusCategory
} from '$lib/api/applicationLog';

import { sortedSchoolNames } from '$lib/api/school';
import { blankStats, type ApplicationDataPoint, type ApplicationStats } from '$lib/api/stats';
import { compareRoundName } from '$lib/util/applicationRoundUtils';
import { lexicalChineseLast, toTitleCase } from '$lib/util/stringUtils';

export function filterByType(
	applications: ComposedApplication[],
	type: ProgramType | 'Graduate'
): ComposedApplication[] {
	if (type === 'Graduate') {
		return applications.filter((application) => isGraduate(application));
	} else {
		return applications.filter((application) => application.program.type === type);
	}
}

export function isUndergraduate(application: ComposedApplication) {
	return application.program.type === 'UG Freshman' || application.program.type === 'UG Transfer';
}

export function isGraduate(application: ComposedApplication) {
	return application.program.type === "Master's" || application.program.type === 'Doctorate';
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
		case 'masters':
			return "Master's";
		case 'doctorate':
			return 'Doctorate';
		case 'other':
			return 'Non-degree';
		default:
			return applicationType;
	}
}

export function formatApplicationStatusCategory(
	category: ApplicationStatusCategory | string
): string {
	return toTitleCase(category);
}

export function getLatestLog(application: ComposedApplication): ApplicationLogBrief | null {
	if (!application.logs.length) {
		return null;
	}
	const logsOrderedByDateDesc = application.logs.sort((a, b) => b.date.localeCompare(a.date));
	return logsOrderedByDateDesc[0];
}

function isIgnorable(status: ApplicationStatus) {
	return status === 'Started' || status === 'Submitted' || status === 'Under Review';
}

export function getNotableStatuses(application: {
	logs: ApplicationLogBrief[];
}): ApplicationStatus[] {
	const statuses = application.logs
		.sort((a, b) => a.date.localeCompare(b.date))
		.map((log) => log.status);

	const notableStatuses = statuses.filter((status) => !isIgnorable(status));

	if (notableStatuses.length) {
		return notableStatuses;
	} else {
		return statuses.slice(statuses.length - 1);
	}
}

export function formatNotableStatuses(statuses: ApplicationStatus[]): string {
	return statuses
		.map((status, index) => {
			// if 'Deferred' or 'On Waitlist' is not the latest status, use abbreviation
			if (status === 'Deferred' && index < statuses.length - 1) {
				return 'D';
			}
			if (status === 'On Waitlist' && index < statuses.length - 1) {
				return 'WL';
			} else if (status === 'On Waitlist') {
				// shorten 'On Waitlist' to 'Waitlist'
				return 'Waitlist';
			}
			// else return the status as is
			return status;
		})
		.join(' - ');
}

export function orderByRoundName(a: ComposedApplication, b: ComposedApplication) {
	return compareRoundName(a.round_name, b.round_name);
}

export function orderByStatus(a: ComposedApplication, b: ComposedApplication) {
	const aStatusOrder: number =
		applicationStatusOrder[getLatestLog(a)?.status as ApplicationStatus] ?? -1;
	const bStatusOrder: number =
		applicationStatusOrder[getLatestLog(b)?.status as ApplicationStatus] ?? -1;
	return aStatusOrder - bStatusOrder;
}

export function orderByStatusDateDesc(a: ComposedApplication, b: ComposedApplication) {
	return (getLatestLog(b)?.date ?? '').localeCompare(getLatestLog(a)?.date ?? '');
}

export function orderByType(a: ComposedApplication, b: ComposedApplication) {
	return _typeOrdering[a.program.type] - _typeOrdering[b.program.type];
}

export function orderByYearDesc(a: ComposedApplication, b: ComposedApplication) {
	return b.year - a.year;
}

export function orderByDueDate(a: ComposedApplication, b: ComposedApplication) {
	return (a.due_date ?? '').localeCompare(b.due_date ?? '');
}

export function orderBySchoolName(a: ComposedApplication, b: ComposedApplication) {
	const aNames = sortedSchoolNames(a.schools);
	const bNames = sortedSchoolNames(b.schools);

	// since each application is associated with at most two schools
	if (aNames[0] !== bNames[0]) {
		return lexicalChineseLast(aNames[0], bNames[0]);
	} else {
		return lexicalChineseLast(aNames[1] ?? '', bNames[0] ?? '');
	}
}

export function orderByStudentName(a: ComposedApplication, b: ComposedApplication) {
	return a.student.fullname.localeCompare(b.student.fullname, 'zh-CN');
}

export function groupByYear(
	applications: ComposedApplication[]
): Record<string, ComposedApplication[]> {
	const grouped: Record<string, ComposedApplication[]> = {};

	for (const appl of applications) {
		const key = appl.year.toString();
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(appl);
	}

	const sortedGroups: Record<string, ComposedApplication[]> = {};
	const sortedKeys = Object.keys(grouped).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

	for (const key of sortedKeys) {
		// Add a trailing space to prevent JS from reordering the keys
		sortedGroups[`${key} `] = grouped[key];
	}
	return sortedGroups;
}

export function groupByType(
	applications: ComposedApplication[]
): Record<string, ComposedApplication[]> {
	const grouped: Record<string, ComposedApplication[]> = {};

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

	const sortedGroups: Record<string, ComposedApplication[]> = {};
	const sortedKeys = Object.keys(grouped).sort((a, b) => _typeOrdering[a] - _typeOrdering[b]);

	for (const key of sortedKeys) {
		sortedGroups[key] = grouped[key];
	}
	return sortedGroups;
}

export function foldStatus(
	status: ApplicationStatus | null | undefined
): Exclude<ApplicationStatusCategory, 'resolved'> {
	switch (status) {
		case 'Accepted':
			return 'accepted';
		case 'Rejected':
		case 'Pres. Rejected':
		case 'Offer Rescinded':
			return 'denied';
		case 'Cancelled':
		case 'Withdrawn':
		case 'Untracked':
			return 'neutral';
		default:
			return 'pending';
	}
}

function toDataPoint(application: ComposedApplication): ApplicationDataPoint {
	const latestStatus = getLatestLog(application)?.status;

	return {
		gender: application.student.gender,
		year: application.year,
		round_name: application.round_name,
		status: foldStatus(latestStatus)
	};
}

function toDataPoints(applications: ComposedApplication[]): ApplicationDataPoint[] {
	return applications.map((appl) => toDataPoint(appl));
}

function aggregateDataPoints(dataPoints: ApplicationDataPoint[]): ApplicationStats {
	const stats: ApplicationStats = blankStats();

	for (const dataPoint of dataPoints) {
		stats.applied++;
		stats[dataPoint.status]++;
	}

	return stats;
}

function aggregateDataPointsByYear(
	dataPoints: ApplicationDataPoint[]
): Record<number, ApplicationStats> {
	const statsByYear: Record<string, ApplicationStats> = {};

	for (const dataPoint of dataPoints) {
		const year = dataPoint.year.toString();

		if (!(year in statsByYear)) {
			statsByYear[year] = blankStats();
		}
		statsByYear[year].applied++;
		statsByYear[year][dataPoint.status]++;
	}

	return statsByYear;
}

function aggregateDataPointsByGender(
	dataPoints: ApplicationDataPoint[]
): Record<number, ApplicationStats> {
	const statsByGender: Record<string, ApplicationStats> = {
		female: blankStats(),
		male: blankStats()
	};

	for (const dataPoint of dataPoints) {
		const { gender } = dataPoint;

		if (!(gender in statsByGender)) {
			statsByGender[gender] = blankStats();
		}
		statsByGender[gender].applied++;
		statsByGender[gender][dataPoint.status]++;
	}

	return statsByGender;
}

function aggregateDataPointsByApplicationRound(
	dataPoints: ApplicationDataPoint[]
): Record<number, ApplicationStats> {
	const statsByGender: Record<string, ApplicationStats> = {};

	for (const dataPoint of dataPoints) {
		const round = dataPoint.round_name;

		if (!(round in statsByGender)) {
			statsByGender[round] = blankStats();
		}
		statsByGender[round].applied++;
		statsByGender[round][dataPoint.status]++;
	}

	return statsByGender;
}

export function getStats(applications: ComposedApplication[]): ApplicationStats {
	return aggregateDataPoints(toDataPoints(applications));
}

export function getStatsByYear(
	applications: ComposedApplication[]
): Record<string, ApplicationStats> {
	return aggregateDataPointsByYear(toDataPoints(applications));
}

export function getStatsByGender(
	applications: ComposedApplication[]
): Record<string, ApplicationStats> {
	return aggregateDataPointsByGender(toDataPoints(applications));
}

export function getStatsByApplicationRound(
	applications: ComposedApplication[]
): Record<string, ApplicationStats> {
	return aggregateDataPointsByApplicationRound(toDataPoints(applications));
}
