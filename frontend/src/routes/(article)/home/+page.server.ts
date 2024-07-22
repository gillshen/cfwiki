import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newStudentSchema } from '$lib/schemas/newStudent.js';
import { createStudent } from '$lib/api/student.js';

export async function load(event) {
	const newStudentForm = await superValidate(zod(newStudentSchema));
	return { newStudentForm };
}

export const actions = {
	createStudent: async ({ request }) => {
		const form = await superValidate(request, zod(newStudentSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Create the student
		const createStudentResponse = await createStudent(form.data);
		if (!createStudentResponse.ok) {
			console.log(createStudentResponse);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		// Redirect to the student page
		const createdStudent = await createStudentResponse.json();
		throw redirect(303, `../student/${createdStudent.id}`);
	}
};
