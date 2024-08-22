import { get, patch, post, destroy, buildQuery } from '$lib/api/api';

export const programTypes = [
	'UG Freshman',
	'UG Transfer',
	"Master's",
	'Doctorate',
	'Non-degree'
] as const;

export type ProgramType = (typeof programTypes)[number];

export type Program = {
	// used by the update form
	id: number;
	type: string;
	name: string;
	degree: string;
};

type School = {
	id: number;
	name: string;
	alt_name: string;
};

export type ProgramListItem = Program & {
	schools: School[];
	display_name: string;
};

export type ProgramWithStats = ProgramListItem & {
	application_stats: {
		applied: number;
		pending: number;
		accepted: number;
		denied: number;
		neutral: number;
	};
};

export type ProgramDetail = ProgramWithStats;

export async function fetchPrograms(params?: {
	type: 'undergraduate' | 'graduate' | 'non-degree';
}): Promise<ProgramListItem[]> {
	return await get(`programs/${buildQuery(params)}`);
}

export async function fetchProgramsWithStats(params?: {
	type: 'undergraduate' | 'graduate' | 'non-degree';
}): Promise<ProgramDetail[]> {
	return await get(`programs/stats/${buildQuery(params)}`);
}

export async function fetchProgram(id: number): Promise<ProgramDetail> {
	return await get(`programs/${id}/`);
}

export async function createProgram(data: any) {
	return await post('programs/new/', data);
}

export async function updateProgram(data: any) {
	return await patch(`programs/${data.id}/update/`, data);
}

export async function deleteProgram(data: any) {
	return await destroy(`programs/${data.id}/update/`);
}
