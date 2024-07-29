import { get, patch, post } from '$lib/api/api';

export const programTypes = ['UG Freshman', 'UG Transfer', "Master's", 'PhD', 'Other'] as const;
export type ProgramType = (typeof programTypes)[number];

type School = {
	id: number;
	name: string;
};

export type ProgramListItem = {
	id: number;
	schools: School[];
	type: string;
	name: string;
	degree: string;
	display_name: string;
};

export async function fetchPrograms(): Promise<ProgramListItem[]> {
	return await get('programs/');
}

export async function fetchProgram(id: number): Promise<ProgramListItem> {
	return await get(`programs/${id}/`);
}

export async function createProgram(data: any) {
	return await post('programs/new/', data);
}

export async function updateProgram(data: any) {
	return await patch(`programs/${data.id}/update/`, data);
}
