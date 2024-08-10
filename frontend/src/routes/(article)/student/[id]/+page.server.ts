import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchStudent, type StudentDetail } from '$lib/api/student';
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
import { createOrUpdateContract } from '$lib/api/contract';
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

	const contractForm = await superValidate(zod(contractSchema));
	const enrollmentForm = await superValidate(zod(enrollmentSchema));
	const toeflForm = await superValidate(zod(toeflSchema));
	const ieltsForm = await superValidate(zod(ieltschema));
	const duolingoForm = await superValidate(zod(duolingoSchema));
	const satScoreForm = await superValidate(zod(satScoreSchema));
	const actScoreForm = await superValidate(zod(actScoreSchema));
	const apScoreForm = await superValidate(zod(apScoreSchema));
	const ibGradeForm = await superValidate(zod(ibGradeSchema));
	const alevelGradeForm = await superValidate(zod(alevelGradeSchema));
	const greScoreForm = await superValidate(zod(greScoreSchema));

	return {
		student,
		contractForm,
		enrollmentForm,
		toeflForm,
		ieltsForm,
		duolingoForm,
		satScoreForm,
		actScoreForm,
		apScoreForm,
		ibGradeForm,
		alevelGradeForm,
		greScoreForm
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
	createOrUpdateGreScore: formAction(greScoreSchema, createOrUpdateGreScore)
};
