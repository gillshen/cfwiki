import { get } from '$lib/api/api';

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
