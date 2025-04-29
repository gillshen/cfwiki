import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { studentSchema } from '$lib/schemas/student';
import { createStudent } from '$lib/api/student';
import { formAction } from '$lib/util/formUtils';

export async function load() {
	return { studentForm: await superValidate(zod(studentSchema)) };
}

export const actions = {
	createStudent: formAction(studentSchema, createStudent, async ({ response }) => {
		const newStudent = await response?.json();
		throw redirect(303, `/student/${newStudent.id}`);
	})
};
