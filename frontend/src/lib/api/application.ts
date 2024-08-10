import { get, post } from '$lib/api/api';
import type { ApplicationStatus, ApplicationLog } from '$lib/api/applicationLog';

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
	program: { display_name: string };
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
	let queryString = '';

	if (params) {
		queryString =
			'?' +
			Object.entries(params)
				.map(([key, value]) => `${key}=${value}`)
				.join('&');
	}

	return await get(`applications/${queryString}`);
}

export async function fetchApplication(id: number): Promise<ApplicationDetail> {
	return await get(`applications/${id}/`);
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
