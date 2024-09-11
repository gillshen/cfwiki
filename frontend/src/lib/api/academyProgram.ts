import { destroy, get, patch, post } from '$lib/api/api';

export type AcademyProgramListItem = {
	id: number;
	name: string;
	category: 'club' | '';
};

export type AcademyProgramDetail = AcademyProgramListItem & {
	students: { id: number; fullname: string }[];
};

export async function fetchAcademyPrograms(): Promise<AcademyProgramListItem[]> {
	return await get('cf/academy-programs/');
}

export async function fetchAcademyProgram(id: number): Promise<AcademyProgramDetail> {
	return await get(`cf/academy-programs/${id}/`, 'Program not found');
}

export async function createAcademyProgram(data: any) {
	return await post('cf/academy-programs/new/', data);
}

export async function updateAcademyProgam(data: any) {
	return await patch(`cf/academy-programs/${data.id}/update/`, data);
}

export async function deleteAcademyProgram(data: any) {
	return await destroy(`cf/academy-programs/${data.id}/update/`);
}
