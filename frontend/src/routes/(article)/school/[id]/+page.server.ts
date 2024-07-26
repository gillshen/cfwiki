import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchSchool, updateSchool, type School } from '$lib/api/school';
import { schoolSchema } from '$lib/schemas/school';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const school: School = await fetchSchool(id);

	if (school?.id === undefined) {
		throw error(404, 'School not found');
	}

	const schoolForm = await superValidate(school, zod(schoolSchema));

	return { school, schoolForm };
}

export const actions = {
	updateSchool: async ({ request }) => {
		const form = await superValidate(request, zod(schoolSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Update the school
		const response = await updateSchool(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		return message(form, 'success');
	}
};
