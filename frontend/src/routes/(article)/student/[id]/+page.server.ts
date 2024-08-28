import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { deleteStudent, fetchStudent, type StudentDetail } from '$lib/api/student';
import { fetchApplications } from '$lib/api/application';
import { fetchSchools } from '$lib/api/school';
import { contractSchema } from '$lib/schemas/contract';
import { enrollmentSchema } from '$lib/schemas/enrollment';

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

import { createOrUpdateContract, deleteContract } from '$lib/api/contract';
import { createOrUpdateEnrollment, deleteEnrollment } from '$lib/api/enrollment';

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

import { formAction } from '$lib/abstract/formAction';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const student: StudentDetail = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Student not found');
	}

	return {
		student,
		promisedSchools: fetchSchools(),
		applications: fetchApplications({ student: student.id }),
		contractForm: await superValidate(zod(contractSchema)),
		enrollmentForm: await superValidate(zod(enrollmentSchema)),
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
	createOrUpdateContract: formAction(contractSchema, createOrUpdateContract),
	createOrUpdateEnrollment: formAction(enrollmentSchema, createOrUpdateEnrollment),
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

	deleteStudent: formAction(deleteSchema, deleteStudent, () => {
		throw redirect(303, '/home');
	}),

	deleteContract: formAction(deleteSchema, deleteContract),
	deleteEnrollment: formAction(deleteSchema, deleteEnrollment),
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
