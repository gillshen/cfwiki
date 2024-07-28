import type { PageServerLoadEvent } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { createApplication } from '$lib/api/application';
import { newApplicationSchema } from '$lib/schemas/application';
import { fetchStudent, type StudentListItem } from '$lib/api/student';
import { fetchSchools } from '$lib/api/school';
import { fetchPrograms } from '$lib/api/program';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const student: StudentListItem = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Student not found');
	}

	const schools = await fetchSchools();
	const programs = await fetchPrograms();
	const newApplicationForm = await superValidate(zod(newApplicationSchema));

	return { student, schools, programs, newApplicationForm };
}

export const actions = {
	createApplication: async ({ request }) => {
		const form = await superValidate(request, zod(newApplicationSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Create the application
		const response = await createApplication(form.data);

		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		// Redirect to the application page
		const createdApplication = await response.json();
		throw redirect(303, `/application/${createdApplication.id}`);
	}
};
