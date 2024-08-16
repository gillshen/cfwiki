import { get, patch, post, destroy } from '$lib/api/api';
import { orderByName } from '$lib/api/school';

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

export type ProgramDetail = ProgramListItem;

export async function fetchPrograms(): Promise<ProgramListItem[]> {
	return await get('programs/');
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

export function formatSchoolNamesShort(program: ProgramListItem | ProgramDetail): string {
	return orderByName(program.schools)
		.map((s) => s.alt_name || s.name)
		.join(' + ');
}

export function isUndergraduate(program: { type: string }): boolean {
	return program.type === 'UG Freshman' || program.type === 'UG Transfer';
}
