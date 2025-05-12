import { z } from 'zod';
import { get, patch, post, destroy, makeUrl } from '$lib/api/core';
import type { ApplicationStats } from '$lib/api/stats';
import type { NewProgramSchema, ProgramUpdateSchema } from '$lib/schemas/program';

export const PROGRAM_CATEGORIES = ['Undergraduate', "Master's", 'Doctorate', 'Non-degree'] as const;

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number];

export const PROGRAM_TYPES = [
	'UG Freshman',
	'UG Transfer',
	"Master's",
	'Doctorate',
	'Non-degree'
] as const;

export type ProgramType = (typeof PROGRAM_TYPES)[number];

export type Program = {
	id: number;
	type: ProgramType;
	name: string;
	degree: string;
	is_defunct: boolean;
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
	return await get(makeUrl('programs', params));
}

export async function fetchApplicationStats(params?: {
	program_id?: number;
	application_type?: 'undergraduate' | 'freshman' | 'transfer' | 'graduate' | 'other';
}): Promise<ApplicationStats[]> {
	return await get(makeUrl('applications/stats/programs', params));
}

export async function fetchProgram(id: number): Promise<ProgramDetail> {
	return await get(`programs/${id}/`, 'Program not found');
}

export async function createProgram(data: z.infer<NewProgramSchema>) {
	return await post('programs/new/', data);
}

export async function updateProgram(data: z.infer<ProgramUpdateSchema>) {
	return await patch(`programs/${data.id}/update/`, data);
}

export async function deleteProgram(data: { id: number }) {
	return await destroy(`programs/${data.id}/update/`);
}
