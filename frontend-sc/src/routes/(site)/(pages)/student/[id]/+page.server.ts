import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';

import { fetchComposedApplications } from '$lib/api/application';
import { deleteSchema } from '$lib/schemas/delete';
import { newApplicationPrepSchema } from '$lib/schemas/application';
import { formAction } from '$lib/util/formUtils';
import { deleteStudent } from '$lib/api/student';

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

import {
	createOrUpdateToeflScore,
	createOrUpdateIeltsScore,
	createOrUpdateDuolingoScore,
	createOrUpdateSatScore,
	createOrUpdateActScore,
	createOrUpdateApScore,
	createOrUpdateIbGrade,
	createOrUpdateAlevelGrade,
	createOrUpdateGreScore,
	createOrUpdateGmatScore,
	createOrUpdateLsatScore,
	deleteToeflScore,
	deleteIeltsScore,
	deleteDuolingoScore,
	deleteSatScore,
	deleteActScore,
	deleteApScore,
	deleteIbGrade,
	deleteAlevelGrade,
	deleteGreScore,
	deleteGmatScore,
	deleteLsatScore
} from '$lib/api/scores';

export async function load(event) {
	const { student } = await event.parent();

	return {
		applications: fetchComposedApplications({ student: student.id }),
		newApplicationPrepForm: await superValidate(zod(newApplicationPrepSchema)),
		// TODO
		scoreForms: {
			toefl: await superValidate(zod(toeflSchema)),
			ielts: await superValidate(zod(ieltschema)),
			duolingo: await superValidate(zod(duolingoSchema)),
			sat: await superValidate(zod(satScoreSchema)),
			act: await superValidate(zod(actScoreSchema)),
			ap: await superValidate(zod(apScoreSchema)),
			ib: await superValidate(zod(ibGradeSchema)),
			alevel: await superValidate(zod(alevelGradeSchema)),
			gre: await superValidate(zod(greScoreSchema)),
			gamt: await superValidate(zod(gmatScoreSchema)),
			lsat: await superValidate(zod(lsatScoreSchema))
		},
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	startApplication: async ({ request }) => {
		const form = await superValidate(request, zod(newApplicationPrepSchema));
		console.log(form.data);

		if (!form.valid) {
			return fail(400, { form });
		}
		const token = jwt.sign(form.data, JWT_SECRET_KEY);
		throw redirect(302, `/application/new?token=${token}`);
	},

	createOrUpdateToeflScore: formAction(toeflSchema, createOrUpdateToeflScore),
	createOrUpdateIeltsScore: formAction(ieltschema, createOrUpdateIeltsScore),
	createOrUpdateDuolingoScore: formAction(duolingoSchema, createOrUpdateDuolingoScore),
	createOrUpdateSatScore: formAction(satScoreSchema, createOrUpdateSatScore),
	createOrUpdateActScore: formAction(actScoreSchema, createOrUpdateActScore),
	createOrUpdateApScore: formAction(apScoreSchema, createOrUpdateApScore),
	createOrUpdateIbGrade: formAction(ibGradeSchema, createOrUpdateIbGrade),
	createOrUpdateAlevelGrade: formAction(alevelGradeSchema, createOrUpdateAlevelGrade),
	createOrUpdateGreScore: formAction(greScoreSchema, createOrUpdateGreScore),
	createOrUpdateGmatScore: formAction(gmatScoreSchema, createOrUpdateGmatScore),
	createOrUpdateLsatScore: formAction(lsatScoreSchema, createOrUpdateLsatScore),

	deleteStudent: formAction(deleteSchema, deleteStudent, {
		onSuccess: () => {
			throw redirect(303, '/home');
		}
	}),

	deleteToeflScore: formAction(deleteSchema, deleteToeflScore),
	deleteIeltsScore: formAction(deleteSchema, deleteIeltsScore),
	deleteDuolingoScore: formAction(deleteSchema, deleteDuolingoScore),
	deleteSatScore: formAction(deleteSchema, deleteSatScore),
	deleteActScore: formAction(deleteSchema, deleteActScore),
	deleteApScore: formAction(deleteSchema, deleteApScore),
	deleteIbGrade: formAction(deleteSchema, deleteIbGrade),
	deleteAlevelGrade: formAction(deleteSchema, deleteAlevelGrade),
	deleteGreScore: formAction(deleteSchema, deleteGreScore),
	deleteGmatScore: formAction(deleteSchema, deleteGmatScore),
	deleteLsatScore: formAction(deleteSchema, deleteLsatScore)
};
