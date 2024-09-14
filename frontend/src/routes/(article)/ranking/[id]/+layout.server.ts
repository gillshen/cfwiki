import { error } from '@sveltejs/kit';
import { fetchSchoolRanking } from '$lib/api/ranking';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid ranking ID');
	}
	return { ranking: await fetchSchoolRanking(id) };
}
