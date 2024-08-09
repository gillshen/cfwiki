import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';
import { newProgramSchema } from '$lib/schemas/program';
import { fetchStudent, type StudentDetail } from '$lib/api/student';
import { fetchSchools } from '$lib/api/school';
import { createProgram, fetchPrograms } from '$lib/api/program';
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

	const schools = await fetchSchools();
	const programs = await fetchPrograms();
	const newProgramForm = await superValidate(zod(newProgramSchema));

	return { student, schools, programs, newProgramForm };
}

export const actions = {
	gotoCreateApplication: async ({ request }) => {
		const data = await request.formData();
		const payload = {
			student: data.get('student'),
			contract: data.get('contract'),
			program: data.get('program')
		};
		const token = jwt.sign(payload, JWT_SECRET_KEY);
		throw redirect(302, `/application/new?token=${token}`);
	},

	createProgram: formAction(newProgramSchema, createProgram)
};
