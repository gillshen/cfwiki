import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schoolSchema } from '$lib/schemas/school';
import { createSchool } from '$lib/api/school';
import { formAction } from '$lib/util/formUtils';

export async function load() {
	return { schoolForm: await superValidate(zod(schoolSchema)) };
}

export const actions = {
	createSchool: formAction(schoolSchema, createSchool, {
		onSuccess: async ({ response }) => {
			const newSchool = await response?.json();
			throw redirect(303, `/school/${newSchool.id}`);
		}
	})
};
