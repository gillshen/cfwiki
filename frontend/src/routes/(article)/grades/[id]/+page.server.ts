import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchEnrollment } from '$lib/api/enrollment';
import { gradeSchema } from '$lib/schemas/grade';
import { createOrUpdateGrade } from '$lib/api/grade';
import { formAction } from '$lib/abstract/formAction';

export async function load(event: PageServerLoadEvent) {
	const enrollmentId = parseInt(event.params.id, 10);

	if (isNaN(enrollmentId)) {
		throw error(404, 'Invalid id');
	}

	const enrollment = await fetchEnrollment(enrollmentId);

	if (enrollment?.id === undefined) {
		throw error(404, 'Educational experience not found');
	}

	const gradeForm = await superValidate(zod(gradeSchema));

	return { enrollment, gradeForm };
}

export const actions = {
	createOrUpdateGrade: formAction(gradeSchema, createOrUpdateGrade)
};
