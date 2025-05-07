import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { deleteEnrollment, fetchEnrollment, updateEnrollment } from '$lib/api/enrollment';
import { enrollmentUpdateSchema } from '$lib/schemas/enrollment';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event) {
	const id = base10Or400(event.params.enrollmentId, 'Invalid enrollment ID');
	const enrollment = await fetchEnrollment(id);

	return {
		enrollment,
		enrollmentForm: await superValidate(enrollment, zod(enrollmentUpdateSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	updateEnrollment: formAction(enrollmentUpdateSchema, updateEnrollment),
	deleteEnrollment: formAction(deleteSchema, deleteEnrollment, async ({ response }) => {
		const student = await response?.json();
		throw redirect(303, `/student/${student.id}`);
	})
};
