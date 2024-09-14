import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	createOrUpdateSchoolRankingEntry,
	deleteSchoolRankingEntry,
	fetchSchoolRankingEntries
} from '$lib/api/ranking';

import { fetchSchools } from '$lib/api/school';
import { rankingEntrySchema } from '$lib/schemas/ranking';
import { formAction } from '$lib/abstract/formAction';
import { deleteSchema } from '$lib/schemas/delete';

let rankingId: number;
let rankingYear: number;

export async function load(event) {
	const { ranking } = await event.parent();

	const year = parseInt(event.params.year, 10);

	if (isNaN(year)) {
		throw error(404, 'Invalid year');
	}
	if (!ranking.editions.includes(year)) {
		throw error(404, `Edition ${year} not found`);
	}

	rankingId = ranking.id;
	rankingYear = year;

	return {
		year,
		rankingEntries: fetchSchoolRankingEntries({ ranking: ranking.id, year }),
		rankingEntryForm: await superValidate(zod(rankingEntrySchema)),
		deleteForm: await superValidate(zod(deleteSchema)),
		schools: await fetchSchools({ type: 'university' })
	};
}

export const actions = {
	createOrUpdateRankingEntry: formAction(rankingEntrySchema, createOrUpdateSchoolRankingEntry),

	deleteRankingEntry: formAction(deleteSchema, deleteSchoolRankingEntry, async () => {
		// if no entry left, redirect to the index page
		const rankingEntries = await fetchSchoolRankingEntries({
			ranking: rankingId,
			year: rankingYear
		});
		if (!rankingEntries.length) {
			throw redirect(303, '/ranking/index');
		}
	})
};
