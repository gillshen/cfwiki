import { get, patch, post, destroy, buildQuery } from '$lib/api/api';

export type School = {
	id: number;
	name: string;
	alt_name: string;
	type: 'University' | 'Secondary School' | 'Other';
	country: string;
};

export async function fetchSchools(params?: {
	type: 'university' | 'secondary-school' | 'other';
}): Promise<School[]> {
	return await get(`schools/${buildQuery(params)}`);
}

export async function fetchSchool(id: number): Promise<School> {
	return await get(`schools/${id}/`);
}

export async function createSchool(data: any) {
	return await post('schools/new/', data);
}

export async function updateSchool(data: any) {
	return await patch(`schools/${data.id}/update/`, data);
}

export async function deleteSchool(data: any) {
	return await destroy(`schools/${data.id}/update/`);
}

export function sortedSchoolNames(schools: { name: string }[]): string[] {
	return schools.map((s) => s.name).sort();
}

export function orderByName<T extends { name: string }>(schools: T[]): T[] {
	return schools.sort((a, b) => a.name.localeCompare(b.name));
}
