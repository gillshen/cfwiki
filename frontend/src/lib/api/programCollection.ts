import type { ProgramListItem } from '$lib/api/program';
import { get, patch, post, destroy } from '$lib/api/api';

export type ProgramCollectionListItem = {
	id: number;
	name: string;
	creator_name: string;
	is_public: boolean;
	programs: ProgramListItem[];
};

export type ProgramCollectionDetail = ProgramCollectionListItem;

export async function fetchProgramCollections(): Promise<ProgramCollectionListItem[]> {
	return await get('collections/');
}
export async function fetchProgramCollection(id: number): Promise<ProgramCollectionDetail> {
	return await get(`collections/${id}/`, 'Collection not found');
}

export async function createProgramCollection(data: any) {
	return await post(`collections/new/`, data);
}

export async function updateProgramCollection(data: any) {
	return patch(`collections/${data.id}/update/`, data);
}

export async function deleteProgramCollection(data: any) {
	return await destroy(`collections/${data.id}/update/`);
}
