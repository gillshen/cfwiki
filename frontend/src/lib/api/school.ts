import { get, patch, post } from '$lib/api/api';

export type School = {
	id: number;
	name: string;
	alt_name: string;
	type: 'University' | 'Secondary School' | 'Other';
	country: string;
};

export async function fetchSchools(): Promise<School[]> {
	return await get('schools/');
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
