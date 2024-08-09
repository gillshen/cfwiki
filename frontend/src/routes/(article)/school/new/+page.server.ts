import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newSchoolSchema } from '$lib/schemas/school';
import { createSchool } from '$lib/api/school';
import { formAction } from '$lib/abstract/formAction.js';

export async function load(event) {
	const newSchoolForm = await superValidate(zod(newSchoolSchema));
	return { newSchoolForm };
}

export const actions = {
	createSchool: formAction(newSchoolSchema, createSchool, (newSchool) => {
		throw redirect(303, `/school/${newSchool.id}`);
	})
};
