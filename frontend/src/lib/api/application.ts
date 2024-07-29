import { get, post } from '$lib/api/api';
import type { ApplicationStatus } from '$lib/api/applicationLog';

type School = {
	id: number;
	name: string;
	alt_name: string;
	country: string;
};

type Log = {
	status: ApplicationStatus;
	date: string;
};

export type ApplicationListItem = {
	id: number;
	student: {
		id: number;
		fullname: string;
		gender: 'female' | 'male' | 'other';
		citizenship: string;
	};
	schools: School[];
	program: {
		id: number;
		display_name: string;
	};
	program_iteration: {
		id: number;
		year: number;
		term: string;
	};
	round: {
		id: number;
		name: string;
		due_date: string | null;
		due_time: string | null;
		timezone: string;
		decision_date: string | null;
	};
	latest_log: Log | null;
};

export type ApplicationDetail = ApplicationListItem;

export async function fetchApplications(): Promise<ApplicationListItem[]> {
	return await get('applications/');
}

export async function fetchApplication(id: number): Promise<ApplicationListItem> {
	return await get(`applications/${id}/`);
}

export async function createApplication(data: {
	student: number;
	program_id: number;
	year: number;
	term: string;
	round_name: string;
}) {
	return await post('applications/new/', data);
}
