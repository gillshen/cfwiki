import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { enrollmentSchema } from '$lib/schemas/enrollment';
import { fetchSchools } from '$lib/api/school';
import { formAction } from '$lib/util/formUtils.js';
import { createOrUpdateEnrollment } from '$lib/api/enrollment';

export async function load() {
	return {
		newEnrollmentForm: await superValidate(zod(enrollmentSchema)),
		schools: fetchSchools()
	};
}

export const actions = {
	createEnrollment: formAction(enrollmentSchema, createOrUpdateEnrollment, async ({ response }) => {
		const newEnrollment = await response?.json();
		throw redirect(303, `/student/${newEnrollment.student}/edu/${newEnrollment.id}`);
	})
};
