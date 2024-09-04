import { get, patch, post, destroy, buildQuery } from '$lib/api/api';
import type { ApplicationStats } from '$lib/api/stats';

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
	is_defunct: boolean;
	groups: number[];
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

export type ProgramStats = ApplicationStats & {
	program_id: number;
};

export type ComposedProgramListItem = ProgramListItem & {
	stats: ApplicationStats;
};

export type ProgramDetail = ProgramListItem;

export async function fetchPrograms(params?: {
	school?: number;
	type?: 'undergraduate' | 'freshman' | 'transfer' | 'graduate' | 'other';
}): Promise<ProgramListItem[]> {
	return await get(`programs/${buildQuery(params)}`);
}

export async function fetchApplicationStats(params?: {
	program_id?: number;
	application_type?: 'undergraduate' | 'freshman' | 'transfer' | 'graduate' | 'other';
}): Promise<ApplicationStats[]> {
	return await get(`applications/stats/programs/${buildQuery(params)}`);
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
