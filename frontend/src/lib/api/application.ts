import { get, post, patch, buildQuery, destroy } from '$lib/api/api';
import type { ApplicationStatus, ApplicationLog } from '$lib/api/applicationLog';

export const applicationTypes = ['freshman', 'transfer', 'graduate', 'other'] as const;

export type ApplicationType = (typeof applicationTypes)[number];

type Service = {
	cf_username: string;
	role: string;
};

export type ApplicationListItem = {
	id: number;
	student: {
		id: number;
		fullname: string;
		gender: 'female' | 'male' | 'other';
		citizenship: string;
		best_toefl: number | null;
		best_ielts: number | null;
		best_duolingo: number | null;
		super_sat: number | null;
		super_act: number | null;
		best_gre: number | null;
		best_gmat: number | null;
		best_lsat: number | null;
	};
	services: Service[];
	schools: { name: string; country: string }[];
	program: { type: string; display_name: string };
	program_iteration: { year: number; term: string };
	round: { name: string; due_date: string | null };
	majors_or_track: string;
	comments: string;
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
	major_1: string;
	major_2: string;
	major_3: string;
	track: string;
	comments: string;
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

export async function createApplication(data: any) {
	return await post('applications/new/', data);
}

export async function updateApplication(data: any) {
	return await patch(`applications/${data.id}/update/`, data);
}

export async function deleteApplication(data: any) {
	return await destroy(`applications/${data.id}/update/`);
}
