import { get, patch, post } from '$lib/api/api';

export const programTypes = [
	'UG Freshman',
	'UG Transfer',
	"Master's",
	'Doctoral',
	'Non-degree'
] as const;

export type ProgramType = (typeof programTypes)[number];

type School = {
	id: number;
	name: string;
	alt_name: string;
};

export type ProgramListItem = {
	id: number;
	schools: School[];
	type: string;
	name: string;
	degree: string;
	display_name: string;
};

export type ProgramDetail = ProgramListItem;

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

export function formatSchoolNamesShort(program: ProgramListItem | ProgramDetail): string {
	return program.schools
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((s) => s.alt_name || s.name)
		.join(' + ');
}

export function isUndergraduate(program: ProgramListItem | ProgramDetail): boolean {
	return program.type === 'UG Freshman' || program.type === 'UG Transfer';
}
