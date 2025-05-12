import type { ComposedApplication, ApplicationType } from '$lib/api/application';
import type { ProgramType } from '$lib/api/program';

import {
	applicationStatusOrdering,
	type ApplicationStatus,
	type ApplicationStatusCategory
} from '$lib/api/applicationLog';

import { joinNames } from '$lib/util/schoolUtils';
import { blankStats, type ApplicationDataPoint, type ApplicationStats } from '$lib/api/stats';
import { compareRoundName } from '$lib/util/applicationRoundUtils';
import { lexicalChineseLast, toTitleCase } from '$lib/util/stringUtils';

export const canEdit = (params: {
	user: { username: string; is_staff: boolean; is_active: boolean };
	application: { staff: string[] };
}): boolean => {
	const { application, user } = params;

	if (!user.is_active) {
		return false;
	}
	// TODO uncomment in production
	// if (user.is_staff) {
	// 	return true;
	// }
	return application.staff.includes(user.username);
};

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

export function formatApplicationType(applicationType: ApplicationType | 'All'): string {
	switch (applicationType) {
		case 'All':
			return 'All';
		case 'freshman':
			return 'UG Freshman';
		case 'transfer':
			return 'UG Transfer';
		case 'undergraduate':
			return 'All Undergraduate';
		case 'masters':
			return "Master's";
		case 'doctorate':
			return 'Doctorate';
		case 'graduate':
			return 'All Graduate';
		case 'nondegree':
			return 'Non-degree';
		default:
			throw new Error(`unknown application type: ${applicationType}`);
	}
}

export function formatApplicationStatusCategory(
	category: ApplicationStatusCategory | string
): string {
	return toTitleCase(category);
}

export function formatHistory(statuses: ApplicationStatus[]): string {
	return (
		statuses
			.map((status, index) => {
				// if 'Deferred' or 'On Waitlist' is not the latest status, use abbreviation
				if (status === 'Deferred' && index < statuses.length - 1) {
					return 'D';
				}
				if (status === 'On Waitlist' && index < statuses.length - 1) {
					return 'WL';
				}
				if (status === 'On Waitlist') {
					// shorten 'On Waitlist' to 'Waitlist'
					return 'Waitlist';
				}
				if (status === 'Pres. Rejected') {
					// shorten 'Pres. Rejected' to 'Pres. Rej.'
					return 'Pres. Rej.';
				}
				// else return the status as is
				return status;
			})
			// join with a hyphen surrounded by hair spaces
			.join('\u200a-\u200a')
	);
}

export function orderByRoundName(a: ComposedApplication, b: ComposedApplication) {
	return compareRoundName(a.round_name, b.round_name);
}

const getStatusOrdering = ({ history }: { history: ApplicationStatus[] }): number => {
	const lastStatus = history[history.length - 1];
	return applicationStatusOrdering[lastStatus] ?? -1;
};

export const orderByStatus = (a: ComposedApplication, b: ComposedApplication) =>
	getStatusOrdering(a) - getStatusOrdering(b);

export const orderByLastUpdatedDesc = (a: ComposedApplication, b: ComposedApplication) =>
	(b.last_updated ?? '').localeCompare(a.last_updated ?? '');

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
	const aNames = joinNames(a.schools);
	const bNames = joinNames(b.schools);

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
	const latestStatus = application.history[application.history.length - 1];

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
