import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newSchoolSchema } from '$lib/schemas/school';
import { createSchool } from '$lib/api/school';

export async function load(event) {
	const newSchoolForm = await superValidate(zod(newSchoolSchema));
	return { newSchoolForm };
}

export const actions = {
	createSchool: async ({ request }) => {
		const form = await superValidate(request, zod(newSchoolSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Create the school file
		const response = await createSchool(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		// Redirect to the school page
		const createdSchool = await response.json();
		throw redirect(303, `/school/${createdSchool.id}`);
	}
};
