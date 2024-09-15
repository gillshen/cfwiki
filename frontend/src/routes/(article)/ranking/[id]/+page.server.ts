import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	createOrUpdateSchoolRankingEntry,
	deleteSchoolRankingEntry,
	fetchSchoolRanking,
	fetchSchoolRankingEntries
} from '$lib/api/ranking';

import { fetchSchools } from '$lib/api/school';
import { rankingEntrySchema } from '$lib/schemas/ranking';
import { formAction } from '$lib/abstract/formAction';
import { deleteSchema } from '$lib/schemas/delete';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid ranking ID');
	}
	const ranking = await fetchSchoolRanking(id);

	return {
		ranking,
		rankingEntries: fetchSchoolRankingEntries({ ranking: ranking.id }),
		rankingEntryForm: await superValidate(zod(rankingEntrySchema)),
		deleteForm: await superValidate(zod(deleteSchema)),
		schools: await fetchSchools({ type: 'university' })
	};
}

export const actions = {
	createOrUpdateRankingEntry: formAction(rankingEntrySchema, createOrUpdateSchoolRankingEntry),
	deleteRankingEntry: formAction(deleteSchema, deleteSchoolRankingEntry)
};
