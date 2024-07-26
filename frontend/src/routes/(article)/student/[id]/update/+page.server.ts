import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { message, fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchStudent, updateStudent, type StudentListItem } from '$lib/api/student';
import { studentSchema } from '$lib/schemas/student';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const student: StudentListItem = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Student not found');
	}

	const studentForm = await superValidate(student, zod(studentSchema));

	return { studentForm };
}

export const actions = {
	updateStudent: async ({ request }) => {
		const form = await superValidate(request, zod(studentSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Update the student
		const response = await updateStudent(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		// Redirect to the student page
		throw redirect(303, `/student/${form.data.id}`);
	}
};
