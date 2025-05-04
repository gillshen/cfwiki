import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchEnrollment, updateEnrollment } from '$lib/api/enrollment';
import { enrollmentUpdateSchema } from '$lib/schemas/enrollment';
import { formAction } from '$lib/util/formUtils';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event) {
	const id = base10Or400(event.params.enrollmentId, 'Invalid enrollment ID');
	const enrollment = await fetchEnrollment(id);

	return {
		enrollment,
		enrollmentForm: await superValidate(enrollment, zod(enrollmentUpdateSchema))
	};
}

export const actions = {
	updateEnrollment: formAction(enrollmentUpdateSchema, updateEnrollment)
};
