import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { studentSchema } from '$lib/schemas/student';
import { formAction } from '$lib/util/formUtils';
import { createOrUpdateStudent } from '$lib/api/student';

export async function load(event) {
	const { student } = await event.parent();

	return {
		form: await superValidate(student, zod(studentSchema))
	};
}

export const actions = {
	updateStudent: formAction(studentSchema, createOrUpdateStudent, async ({ response }) => {
		const student = await response?.json();
		throw redirect(303, `/student/${student.id}`);
	})
};
