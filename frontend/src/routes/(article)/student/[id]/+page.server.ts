import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchStudent, type StudentDetail } from '$lib/api/student';
import { fetchApplications } from '$lib/api/application';
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
	greScoreSchema
} from '$lib/schemas/scores';

import { deleteSchema } from '$lib/schemas/delete';

import { createOrUpdateContract, deleteContract } from '$lib/api/contract';
import { createOrUpdateEnrollment } from '$lib/api/enrollment';

import {
	createOrUpdateToeflScore,
	createOrUpdateIeltsScore,
	createOrUpdateDuolingoScore,
	createOrUpdateSatScore,
	createOrUpdateActScore,
	createOrUpdateApScore,
	createOrUpdateIbGrade,
	createOrUpdateAlevelGrade,
	createOrUpdateGreScore
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
		applications: fetchApplications({ student: student.id }),
		contractForm: await superValidate(zod(contractSchema)),
		contractDeleteForm: await superValidate(zod(deleteSchema)),
		enrollmentForm: await superValidate(zod(enrollmentSchema)),
		toeflForm: await superValidate(zod(toeflSchema)),
		ieltsForm: await superValidate(zod(ieltschema)),
		duolingoForm: await superValidate(zod(duolingoSchema)),
		satScoreForm: await superValidate(zod(satScoreSchema)),
		actScoreForm: await superValidate(zod(actScoreSchema)),
		apScoreForm: await superValidate(zod(apScoreSchema)),
		ibGradeForm: await superValidate(zod(ibGradeSchema)),
		alevelGradeForm: await superValidate(zod(alevelGradeSchema)),
		greScoreForm: await superValidate(zod(greScoreSchema))
	};
}

export const actions = {
	createOrUpdateContract: formAction(contractSchema, createOrUpdateContract),
	deleteContract: formAction(deleteSchema, deleteContract),
	createOrUpdateEnrollment: formAction(enrollmentSchema, createOrUpdateEnrollment),
	createOrUpdateToeflScore: formAction(toeflSchema, createOrUpdateToeflScore),
	createOrUpdateIeltsScore: formAction(ieltschema, createOrUpdateIeltsScore),
	createOrUpdateDuolingoScore: formAction(duolingoSchema, createOrUpdateDuolingoScore),
	createOrUpdateSatScore: formAction(satScoreSchema, createOrUpdateSatScore),
	createOrUpdateActScore: formAction(actScoreSchema, createOrUpdateActScore),
	createOrUpdateApScore: formAction(apScoreSchema, createOrUpdateApScore),
	createOrUpdateIbGrade: formAction(ibGradeSchema, createOrUpdateIbGrade),
	createOrUpdateAlevelGrade: formAction(alevelGradeSchema, createOrUpdateAlevelGrade),
	createOrUpdateGreScore: formAction(greScoreSchema, createOrUpdateGreScore)
};
