import { get, post, patch, buildQuery, destroy } from '$lib/api/api';
import type { ApplicationStatus, ApplicationLog } from '$lib/api/applicationLog';
import { sortedSchoolNames } from '$lib/api/school';

type Service = {
	cf_username: string;
	role: string;
};

export type ApplicationListItem = {
	id: number;
	student: {
		fullname: string;
		gender: 'female' | 'male' | 'other';
		citizenship: string;
	};
	services: Service[];
	schools: { name: string; country: string }[];
	program: { type: string; display_name: string };
	program_iteration: { year: number; term: string };
	round: { name: string; due_date: string | null };
	latest_log: { status: ApplicationStatus; date: string } | null;
};

export type ApplicationDetail = {
	id: number;
	student: { id: number; fullname: string };
	services: Service[];
	schools: { id: number; name: string; country: string }[];
	program: { id: number; type: string; display_name: string };
	program_iteration: { id: number; year: number; term: string };
	round: {
		id: number;
		name: string;
		due_date: string | null;
		due_time: string | null;
		timezone: string;
		decision_date: string | null;
	};
	logs: ApplicationLog[];
};

export async function fetchApplications(
	params?: Record<string, any>
): Promise<ApplicationListItem[]> {
	const queryString = buildQuery(params);
	return await get(`applications/${queryString}`);
}

export async function fetchApplication(id: number): Promise<ApplicationDetail> {
	return await get(`applications/${id}/`);
}

export async function fetchCoApplications(
	application: ApplicationDetail
): Promise<ApplicationListItem[]> {
	const coApplications = await fetchApplications({
		program_iteration: application.program_iteration.id
	});
	return coApplications.filter((appl) => appl.id !== application.id);
}

export async function createApplication(data: {
	contract: number;
	program: number;
	year: number;
	term: string;
	round_name: string;
}) {
	return await post('applications/new/', data);
}

export async function changeApplicationRound(data: {
	id: number;
	program: number;
	year: number;
	term: string;
	round_name: string;
}) {
	return await patch(`applications/${data.id}/update-round/`, data);
}

export async function deleteApplication(data: any) {
	return await destroy(`applications/${data.id}/update/`);
}

export const applicationStatusOrder: Record<string, number> = {
	Started: 0,
	Submitted: 1,
	'Under Review': 2,
	Deferred: 3,
	'On Waitlist': 4,
	Accepted: 5,
	Enrolled: 6,
	Rejected: 7,
	'Offer Rescinded': 8,
	Cancelled: 9,
	Withdrawn: 10,
	'Not Tracked': 11
};

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

export function orderByStatus(a: ApplicationListItem, b: ApplicationListItem) {
	const aStatusOrder: number = applicationStatusOrder[a.latest_log?.status ?? ''] ?? -1;
	const bStatusOrder: number = applicationStatusOrder[b.latest_log?.status ?? ''] ?? -1;
	return aStatusOrder - bStatusOrder;
}

export function orderByYearDesc(a: ApplicationListItem, b: ApplicationListItem) {
	return b.program_iteration.year - a.program_iteration.year;
}

export function orderByRoundName(a: ApplicationListItem, b: ApplicationListItem) {
	return (_roundOrder[a.round.name] ?? -1) - (_roundOrder[b.round.name] ?? -1);
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
	}

	if (aNames[1] === bNames[1]) {
		return 0;
	}
	return aNames[1] === undefined
		? -1
		: bNames[1] === undefined
			? 1
			: aNames[1].localeCompare(bNames[1]);
}

export function orderByStudentName(a: ApplicationListItem, b: ApplicationListItem) {
	return a.student.fullname.localeCompare(b.student.fullname);
}
