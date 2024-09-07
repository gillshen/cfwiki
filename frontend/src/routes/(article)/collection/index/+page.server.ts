import { fetchProgramCollections } from '$lib/api/programCollection';

export async function load(_) {
	return { collections: fetchProgramCollections() };
}
