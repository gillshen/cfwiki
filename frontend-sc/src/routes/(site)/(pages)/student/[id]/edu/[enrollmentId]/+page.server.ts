import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { deleteEnrollment, fetchEnrollment, updateEnrollment } from '$lib/api/enrollment';
import { enrollmentUpdateSchema } from '$lib/schemas/enrollment';
import { gradeSchema } from '$lib/schemas/grade';
import { deleteSchema } from '$lib/schemas/delete';
import { createOrUpdateGrade, deleteGrade } from '$lib/api/grade';
import { formAction } from '$lib/util/formUtils';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event) {
	const id = base10Or400(event.params.enrollmentId, 'Invalid enrollment ID');
	const enrollment = await fetchEnrollment(id);

	return {
		enrollment,
		enrollmentForm: await superValidate(enrollment, zod(enrollmentUpdateSchema)),
		gradeForm: await superValidate(zod(gradeSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	updateEnrollment: formAction(enrollmentUpdateSchema, updateEnrollment),
	deleteEnrollment: formAction(deleteSchema, deleteEnrollment, {
		prepForm: (form) => {
			if (form.data._use_comments) {
				form.data.value = null;
				form.data.scale = null;
			} else {
				form.data.comments = '';
			}
			return form;
		},
		onSuccess: async ({ response }) => {
			const student = await response?.json();
			throw redirect(303, `/student/${student.id}`);
		}
	}),
	createOrUpdateGrade: formAction(gradeSchema, createOrUpdateGrade),
	deleteGrade: formAction(deleteSchema, deleteGrade)
};
