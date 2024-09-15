import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { createSchoolRanking, fetchSchoolRankings } from '$lib/api/ranking';
import { fetchSchools } from '$lib/api/school';
import { rankingSchema } from '$lib/schemas/ranking';
import { formAction } from '$lib/abstract/formAction';

export async function load(_) {
	return {
		rankings: fetchSchoolRankings(),
		newRankingForm: await superValidate(zod(rankingSchema)),
		schools: await fetchSchools({ type: 'university' })
	};
}

export const actions = {
	createSchoolRanking: formAction(rankingSchema, createSchoolRanking)
};
