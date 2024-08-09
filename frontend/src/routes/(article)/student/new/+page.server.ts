import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newStudentSchema } from '$lib/schemas/student.js';
import { createStudent } from '$lib/api/student.js';
import { formAction } from '$lib/abstract/formAction.js';

export async function load(event) {
	const newStudentForm = await superValidate(zod(newStudentSchema));
	return { newStudentForm };
}

export const actions = {
	createStudent: formAction(newStudentSchema, createStudent, (newStudent) => {
		throw redirect(303, `/student/${newStudent.id}`);
	})
};
