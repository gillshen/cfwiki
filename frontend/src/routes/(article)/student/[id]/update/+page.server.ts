import type { PageServerLoadEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { updateStudent } from '$lib/api/student';
import { studentSchema } from '$lib/schemas/student';
import { formAction } from '$lib/abstract/formAction';

export async function load(event: PageServerLoadEvent) {
	const { student } = await event.parent();

	return {
		student,
		studentForm: await superValidate(student, zod(studentSchema))
	};
}

export const actions = {
	updateStudent: formAction(studentSchema, updateStudent, (student) => {
		throw redirect(303, `/student/${student.id}`);
	})
};
