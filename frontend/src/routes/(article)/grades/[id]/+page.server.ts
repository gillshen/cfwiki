import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchEnrollment } from '$lib/api/enrollment';
import { fetchStaffList } from '$lib/api/student';
import { gradeSchema } from '$lib/schemas/grade';
import { deleteSchema } from '$lib/schemas/delete';
import { createOrUpdateGrade, deleteGrade } from '$lib/api/grade';
import { formAction } from '$lib/abstract/formAction';

export async function load(event: PageServerLoadEvent) {
	const enrollmentId = parseInt(event.params.id, 10);

	if (isNaN(enrollmentId)) {
		throw error(404, 'Invalid enrollment ID');
	}

	const enrollment = await fetchEnrollment(enrollmentId);
	const staffList = (await fetchStaffList(enrollment.student.id)).staff_names;

	return {
		enrollment,
		staffList,
		gradeForm: await superValidate(zod(gradeSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	createOrUpdateGrade: formAction(gradeSchema, createOrUpdateGrade),
	deleteGrade: formAction(deleteSchema, deleteGrade)
};
