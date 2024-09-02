import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchStudent, updateStudent, type StudentDetail } from '$lib/api/student';
import { studentSchema } from '$lib/schemas/student';
import { formAction } from '$lib/abstract/formAction';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const student: StudentDetail = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Student not found');
	}

	const studentForm = await superValidate(student, zod(studentSchema));

	return { studentForm };
}

export const actions = {
	updateStudent: formAction(studentSchema, updateStudent, (student) => {
		throw redirect(303, `/student/${student.id}`);
	})
};
