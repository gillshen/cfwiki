import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newEnrollmentSchema } from '$lib/schemas/enrollment';
import { schoolSchema } from '$lib/schemas/school';
import { createSchool, fetchSchools } from '$lib/api/school';
import { formAction } from '$lib/util/formUtils';
import { createEnrollment } from '$lib/api/enrollment';

export async function load() {
	return {
		newEnrollmentForm: await superValidate(zod(newEnrollmentSchema)),
		newSchoolForm: await superValidate(zod(schoolSchema)),
		schools: fetchSchools()
	};
}

export const actions = {
	createEnrollment: formAction(newEnrollmentSchema, createEnrollment, async ({ response }) => {
		const newEnrollment = await response?.json();
		throw redirect(303, `/student/${newEnrollment.student}/edu/${newEnrollment.id}`);
	}),
	createSchool: formAction(schoolSchema, createSchool)
};
