import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { studentSchema } from '$lib/schemas/student.js';
import { createStudent } from '$lib/api/student.js';
import { formAction } from '$lib/abstract/formAction.js';

export async function load(event) {
	const studentForm = await superValidate(zod(studentSchema));
	return { studentForm };
}

export const actions = {
	createStudent: formAction(studentSchema, createStudent, (newStudent) => {
		throw redirect(303, `/student/${newStudent.id}`);
	})
};
