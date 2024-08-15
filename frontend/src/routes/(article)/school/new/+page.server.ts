import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schoolSchema } from '$lib/schemas/school';
import { createSchool } from '$lib/api/school';
import { formAction } from '$lib/abstract/formAction.js';

export async function load(_) {
	const schoolForm = await superValidate(zod(schoolSchema));
	return { schoolForm };
}

export const actions = {
	createSchool: formAction(schoolSchema, createSchool, (newSchool) => {
		throw redirect(303, `/school/${newSchool.id}`);
	})
};
