import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schoolSchema } from '$lib/schemas/school';
import { formAction } from '$lib/util/formUtils';
import { updateSchool } from '$lib/api/school';

export async function load(event) {
	const { school } = await event.parent();

	return {
		form: await superValidate(school, zod(schoolSchema))
	};
}

export const actions = {
	updateSchool: formAction(schoolSchema, updateSchool, async ({ response }) => {
		const school = await response?.json();
		throw redirect(303, `/school/${school.id}`);
	})
};
