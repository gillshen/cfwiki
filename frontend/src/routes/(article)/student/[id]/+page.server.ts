import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchStudent, type StudentDetail } from '$lib/api/student';
import { newContractSchema } from '$lib/schemas/contract';
import { newEnrollmentSchema } from '$lib/schemas/enrollment';
import {
	newToeflSchema,
	newIeltschema,
	newSatSchema,
	newActSchema,
	newGreSchema
} from '$lib/schemas/scores';
import { createOrUpdateContract } from '$lib/api/contract';
import { createOrUpdateEnrollment } from '$lib/api/enrollment';
import {
	createOrUpdateToeflScore,
	createOrUpdateSatScore,
	createOrUpdateActScore,
	createOrUpdateIeltsScore,
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

	const contractForm = await superValidate(zod(newContractSchema));
	const enrollmentForm = await superValidate(zod(newEnrollmentSchema));
	const toeflForm = await superValidate(zod(newToeflSchema));
	const ieltsForm = await superValidate(zod(newIeltschema));
	const satScoreForm = await superValidate(zod(newSatSchema));
	const actScoreForm = await superValidate(zod(newActSchema));
	const greScoreForm = await superValidate(zod(newGreSchema));

	return {
		student,
		contractForm,
		enrollmentForm,
		toeflForm,
		ieltsForm,
		satScoreForm,
		actScoreForm,
		greScoreForm
	};
}

export const actions = {
	createOrUpdateContract: formAction(newContractSchema, createOrUpdateContract),
	createOrUpdateEnrollment: formAction(newEnrollmentSchema, createOrUpdateEnrollment),
	createOrUpdateToeflScore: formAction(newToeflSchema, createOrUpdateToeflScore),
	createOrUpdateIeltsScore: formAction(newIeltschema, createOrUpdateIeltsScore),
	createOrUpdateSatScore: formAction(newSatSchema, createOrUpdateSatScore),
	createOrUpdateActScore: formAction(newActSchema, createOrUpdateActScore),
	createOrUpdateGreScore: formAction(newGreSchema, createOrUpdateGreScore)
};
