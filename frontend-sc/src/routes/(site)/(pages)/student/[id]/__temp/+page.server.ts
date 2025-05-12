import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { newProgramSchema } from '$lib/schemas/program';
import { fetchSchools } from '$lib/api/school';
import { createProgram } from '$lib/api/program';
import * as scoreSchemas from '$lib/schemas/scores';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';
import * as scoreApi from '$lib/api/scores';

export async function load() {
	return {
		schools: fetchSchools(),
		newProgramForm: await superValidate(zod(newProgramSchema)),
		toeflForm: await superValidate(zod(scoreSchemas.toeflSchema)),
		ieltsForm: await superValidate(zod(scoreSchemas.ieltschema)),
		duolingoForm: await superValidate(zod(scoreSchemas.duolingoSchema)),

		satForm: await superValidate(zod(scoreSchemas.satScoreSchema)),
		actForm: await superValidate(zod(scoreSchemas.actScoreSchema)),
		apForm: await superValidate(zod(scoreSchemas.apScoreSchema)),
		ibForm: await superValidate(zod(scoreSchemas.ibGradeSchema)),
		alevelForm: await superValidate(zod(scoreSchemas.alevelGradeSchema)),

		greForm: await superValidate(zod(scoreSchemas.greScoreSchema)),
		gmatForm: await superValidate(zod(scoreSchemas.gmatScoreSchema)),
		lsatForm: await superValidate(zod(scoreSchemas.lsatScoreSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	createProgram: formAction(newProgramSchema, createProgram),

	createOrUpdateToeflScore: formAction(scoreSchemas.toeflSchema, scoreApi.createOrUpdateToeflScore),
	createOrUpdateIeltsScore: formAction(scoreSchemas.ieltschema, scoreApi.createOrUpdateIeltsScore),
	createOrUpdateDuolingoScore: formAction(
		scoreSchemas.duolingoSchema,
		scoreApi.createOrUpdateDuolingoScore
	),

	createOrUpdateSatScore: formAction(scoreSchemas.satScoreSchema, scoreApi.createOrUpdateSatScore),
	createOrUpdateActScore: formAction(scoreSchemas.actScoreSchema, scoreApi.createOrUpdateActScore),
	createOrUpdateApScore: formAction(scoreSchemas.apScoreSchema, scoreApi.createOrUpdateApScore),
	createOrUpdateIbGrade: formAction(scoreSchemas.ibGradeSchema, scoreApi.createOrUpdateIbGrade),
	createOrUpdateAlevelGrade: formAction(
		scoreSchemas.alevelGradeSchema,
		scoreApi.createOrUpdateAlevelGrade
	),

	createOrUpdateGreScore: formAction(scoreSchemas.greScoreSchema, scoreApi.createOrUpdateGreScore),
	createOrUpdateGmatScore: formAction(
		scoreSchemas.gmatScoreSchema,
		scoreApi.createOrUpdateGmatScore
	),
	createOrUpdateLsatScore: formAction(
		scoreSchemas.lsatScoreSchema,
		scoreApi.createOrUpdateLsatScore
	),

	deleteToeflScore: formAction(deleteSchema, scoreApi.deleteToeflScore),
	deleteIeltsScore: formAction(deleteSchema, scoreApi.deleteIeltsScore),
	deleteDuolingoScore: formAction(deleteSchema, scoreApi.deleteDuolingoScore),

	deleteSatScore: formAction(deleteSchema, scoreApi.deleteSatScore),
	deleteActScore: formAction(deleteSchema, scoreApi.deleteActScore),
	deleteApScore: formAction(deleteSchema, scoreApi.deleteApScore),
	deleteIbGrade: formAction(deleteSchema, scoreApi.deleteIbGrade),
	deleteAlevelGrade: formAction(deleteSchema, scoreApi.deleteAlevelGrade),

	deleteGreScore: formAction(deleteSchema, scoreApi.deleteGreScore),
	deleteGmatScore: formAction(deleteSchema, scoreApi.deleteGmatScore, {
		prepForm: (form) => {
			if (form.data.is_legacy) {
				// pre-2023 version
				form.data.data_insights = null;
			} else {
				// new version
				form.data.reading = null;
				form.data.writing = null;
			}
			return form;
		}
	}),
	deleteLsatScore: formAction(deleteSchema, scoreApi.deleteLsatScore)
};
