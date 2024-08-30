import { get, post, patch, destroy, buildQuery } from '$lib/api/api';

export type ApplicationRoundListItem = {
	id: number;
	program_iteration: {
		id: number;
		year: number;
		term: string;
		program: number;
	};
	name: string;
	due_date: string | null;
	due_time: string | null;
	timezone: string;
	decision_date: string | null;
	applications_count: number;
};

export type ApplicationRoundDetail = ApplicationRoundListItem;

export async function fetchApplicationRounds(
	params?: Record<string, any>
): Promise<ApplicationRoundListItem[]> {
	return await get(`application-rounds/${buildQuery(params)}`);
}

export async function fetchApplicationRound(id: number): Promise<ApplicationRoundDetail> {
	return await get(`application-rounds/${id}/`);
}

export async function createApplicationRound(data: any) {
	return await post('application-rounds/new/', data);
}

export async function updateApplicationRound(data: any) {
	return await patch(`application-rounds/${data.id}/update/`, data);
}

export async function deleteApplicationRound(data: any) {
	return await destroy(`application-rounds/${data.id}/update/`);
}
