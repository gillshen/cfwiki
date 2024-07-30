import type { PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';
import { fetchStudent, type StudentListItem } from '$lib/api/student';
import { fetchProgram, type ProgramListItem } from '$lib/api/program';
import { newApplicationSchema } from '$lib/schemas/application';
import { createApplication } from '$lib/api/application';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		throw error(400, 'Token required');
	}

	try {
		const { student: studentIdString, program: programIdString } = jwt.verify(
			token,
			JWT_SECRET_KEY
		) as { student: string; program: string };

		const studentId = parseInt(studentIdString, 10);
		const programId = parseInt(programIdString, 10);

		const student: StudentListItem = await fetchStudent(studentId);
		if (student?.id === undefined) {
			throw error(404, 'Student not found');
		}

		const program: ProgramListItem = await fetchProgram(programId);
		if (program?.id === undefined) {
			throw error(404, 'Program not found');
		}

		const newApplicationForm = await superValidate(zod(newApplicationSchema));

		return { student, program, newApplicationForm };
	} catch (err) {
		throw error(400, 'Invalid token');
	}
};

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
