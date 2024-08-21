import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schoolSchema } from '$lib/schemas/school';
import { createSchool } from '$lib/api/school';
import { formAction } from '$lib/abstract/formAction';

export async function load(_) {
	return { schoolForm: await superValidate(zod(schoolSchema)) };
}

export const actions = {
	createSchool: formAction(schoolSchema, createSchool, (newSchool) => {
		throw redirect(303, `/school/${newSchool.id}`);
	})
};
