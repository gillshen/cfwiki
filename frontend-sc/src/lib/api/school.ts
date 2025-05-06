import { z } from 'zod';
import { get, patch, post, destroy, buildQuery } from '$lib/api/core';
import type { SchoolSchema } from '$lib/schemas/school';
import type { ApplicationStats } from '$lib/api/stats';
import type { RecognizedRanking } from '$lib/api/ranking';

export type RankingEntry = {
	ranking_name: RecognizedRanking | string;
	year: number;
	rank: number;
};

export const SCHOOL_TYPES = ['University', 'Secondary School', 'Other'] as const;

export type SchoolType = (typeof SCHOOL_TYPES)[number];

export type School = {
	id: number;
	name: string;
	alt_name: string;
	type: SchoolType;
	country: string;
	region: string;
	city: string;
	rankings: RankingEntry[];
};

export type SchoolStats = {
	school_id: number;
	ug_applied: number;
	ug_pending: number;
	ug_accepted: number;
	ug_denied: number;
	ug_neutral: number;
	grad_applied: number;
	grad_pending: number;
	grad_accepted: number;
	grad_denied: number;
	grad_neutral: number;
};

export type ComposedSchoolListItem = School & {
	ug_stats: ApplicationStats;
	grad_stats: ApplicationStats;
};

export async function fetchSchools(params?: {
	type: 'university' | 'secondary-school' | 'other';
}): Promise<School[]> {
	return await get(`schools/${buildQuery(params)}`);
}

export async function fetchApplicationStats(params?: {
	school_id?: number;
	school_type?: 'university' | 'secondary-school' | 'other';
}): Promise<SchoolStats[]> {
	return await get(`applications/stats/schools/${buildQuery(params)}`);
}

export async function fetchSchool(id: number): Promise<School> {
	return await get(`schools/${id}/`, 'School not found');
}

export async function createSchool(data: z.infer<SchoolSchema>) {
	return await post('schools/new/', data);
}

export async function updateSchool(data: z.infer<SchoolSchema> & { id: number }) {
	return await patch(`schools/${data.id}/update/`, data);
}

export async function deleteSchool(data: { id: number }) {
	return await destroy(`schools/${data.id}/update/`);
}
