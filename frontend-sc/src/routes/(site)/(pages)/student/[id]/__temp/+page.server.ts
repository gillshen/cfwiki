import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	toeflSchema,
	ieltschema,
	duolingoSchema,
	satScoreSchema,
	actScoreSchema,
	apScoreSchema,
	ibGradeSchema,
	alevelGradeSchema,
	greScoreSchema,
	gmatScoreSchema,
	lsatScoreSchema
} from '$lib/schemas/scores';

import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';

import {
	createOrUpdateIeltsScore,
	createOrUpdateToeflScore,
	deleteIeltsScore,
	deleteToeflScore
} from '$lib/api/scores';

export async function load() {
	return {
		toeflForm: await superValidate(zod(toeflSchema)),
		ieltsForm: await superValidate(zod(ieltschema)),
		duolingoForm: await superValidate(zod(duolingoSchema)),
		satForm: await superValidate(zod(satScoreSchema)),
		actForm: await superValidate(zod(actScoreSchema)),
		apForm: await superValidate(zod(apScoreSchema)),
		ibForm: await superValidate(zod(ibGradeSchema)),
		alevelForm: await superValidate(zod(alevelGradeSchema)),
		greForm: await superValidate(zod(greScoreSchema)),
		gamtForm: await superValidate(zod(gmatScoreSchema)),
		lsatForm: await superValidate(zod(lsatScoreSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	createOrUpdateToeflScore: formAction(toeflSchema, createOrUpdateToeflScore),
	createOrUpdateIeltsScore: formAction(ieltschema, createOrUpdateIeltsScore),
	deleteToeflScore: formAction(deleteSchema, deleteToeflScore),
	deleteIeltsScore: formAction(deleteSchema, deleteIeltsScore)
};
