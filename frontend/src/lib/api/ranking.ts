import { buildQuery, createOrUpdate, destroy, get, patch, post } from '$lib/api/api';

export const recognizedRankings = [
	'US News National Universities',
	'US News Liberal Arts Colleges',
	'QS World'
] as const;

export type RecognizedRanking = (typeof recognizedRankings)[number];

export type SchoolRanking = {
	id: number;
	name: RecognizedRanking | string;
	editions: number[];
};

export type SchoolRankingEntry = {
	id: number;
	ranking: { id: number; name: string };
	school: { id: number; name: string };
	year: number;
	rank: number;
};

export async function fetchSchoolRankings(): Promise<SchoolRanking[]> {
	return await get('school-rankings/');
}

export async function fetchSchoolRanking(id: number): Promise<SchoolRanking> {
	return await get(`school-rankings/${id}/`, 'Ranking not found');
}

export async function createSchoolRanking(data: any) {
	return await post('school-rankings/new/', data);
}

export async function updateSchoolRanking(data: any) {
	return await patch(`school-rankings/${data.id}/update/`, data);
}

export async function deleteSchoolRanking(data: any) {
	return await destroy(`school-rankings/${data.id}/update/`);
}

export async function fetchSchoolRankingEntries(params?: {
	ranking?: number;
	year?: number;
}): Promise<SchoolRankingEntry[]> {
	return await get(`school-ranks/${buildQuery(params)}`);
}

export async function createOrUpdateSchoolRankingEntry(data: any) {
	return await createOrUpdate(data, `school-ranks`);
}

export async function deleteSchoolRankingEntry(data: any) {
	return await destroy(`school-ranks/${data.id}/update/`);
}
