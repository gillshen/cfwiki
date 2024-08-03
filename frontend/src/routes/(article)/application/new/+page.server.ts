import type { PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';
import { fetchContract, type Contract } from '$lib/api/contract';
import { fetchProgram, type ProgramListItem } from '$lib/api/program';
import { newApplicationSchema } from '$lib/schemas/application';
import { createApplication } from '$lib/api/application';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		throw error(400, 'Token required');
	}

	try {
		const { contract: contractIdString, program: programIdString } = jwt.verify(
			token,
			JWT_SECRET_KEY
		) as { contract: string; program: string };

		const contractId = parseInt(contractIdString, 10);
		const programId = parseInt(programIdString, 10);

		const contract: Contract = await fetchContract(contractId);
		if (contract?.id === undefined) {
			throw error(404, 'Contract not found');
		}

		const program: ProgramListItem = await fetchProgram(programId);
		if (program?.id === undefined) {
			throw error(404, 'Program not found');
		}

		const newApplicationForm = await superValidate(zod(newApplicationSchema));

		return { contract, program, newApplicationForm };
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
