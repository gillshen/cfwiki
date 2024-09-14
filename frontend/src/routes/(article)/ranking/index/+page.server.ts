import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	createOrUpdateSchoolRankingEntry,
	fetchSchoolRankings,
	type SchoolRankingEntry
} from '$lib/api/ranking';

import { fetchSchools } from '$lib/api/school';
import { rankingEntrySchema } from '$lib/schemas/ranking';
import { formAction } from '$lib/abstract/formAction';

export async function load(_) {
	return {
		rankings: fetchSchoolRankings(),
		newEntryForm: await superValidate(zod(rankingEntrySchema)),
		schools: await fetchSchools({ type: 'university' })
	};
}

export const actions = {
	createOrUpdateRankingEntry: formAction(
		rankingEntrySchema,
		createOrUpdateSchoolRankingEntry,
		(newEntry: SchoolRankingEntry) => {
			throw redirect(303, `/ranking/${newEntry.ranking}/${newEntry.year}`);
		}
	)
};
