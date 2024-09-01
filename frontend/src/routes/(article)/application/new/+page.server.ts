import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';

import { fetchContract, type ContractDetail } from '$lib/api/contract';
import { createSchool, fetchSchools } from '$lib/api/school';
import { createProgram, fetchPrograms } from '$lib/api/program';
import { createApplicationRound, fetchApplicationRounds } from '$lib/api/applicationRound';
import { schoolSchema } from '$lib/schemas/school';
import { batchNewApplicationSchema } from '$lib/schemas/application';
import { newProgramSchema } from '$lib/schemas/program';
import { roundSchema } from '$lib/schemas/applicationRound';
import { createApplication } from '$lib/api/application';
import { formAction } from '$lib/abstract/formAction';

let studentId: number; // for redirecting

export async function load(event: PageServerLoadEvent) {
	const token = event.url.searchParams.get('token');

	if (!token) {
		throw error(400, 'Token required');
	}

	try {
		const {
			student,
			contract: contractIdString,
			type: programType,
			year: yearString,
			term
		} = jwt.verify(token, JWT_SECRET_KEY) as {
			student: string;
			contract: string;
			type: 'freshman' | 'transfer' | 'graduate' | 'nondegree';
			year: string;
			term: string;
		};

		studentId = parseInt(student, 10);
		const contractId = parseInt(contractIdString, 10);
		const contract: ContractDetail = await fetchContract(contractId);

		if (contract?.id === undefined) {
			throw error(404, 'Contract not found');
		}

		const year = parseInt(yearString, 10);

		return {
			studentId,
			contract,
			programType,
			year,
			term,
			schools: programType === 'nondegree' ? fetchSchools() : fetchSchools({ type: 'university' }),
			programs: fetchPrograms({ type: programType }),
			applicationRounds: fetchApplicationRounds({ program_type: programType, year, term }),
			newSchoolForm: await superValidate(zod(schoolSchema)),
			newProgramForm: await superValidate(zod(newProgramSchema)),
			batchNewApplicationForm: await superValidate(zod(batchNewApplicationSchema)),
			newApplicationRoundForm: await superValidate(zod(roundSchema))
		};
	} catch (err) {
		throw error(400, 'Invalid token');
	}
}

export const actions = {
	createSchool: formAction(schoolSchema, createSchool),

	createProgram: formAction(newProgramSchema, createProgram),

	createApplicationRound: formAction(roundSchema, createApplicationRound),

	createApplications: async ({ request }) => {
		const form = await superValidate(request, zod(batchNewApplicationSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { contract, rounds } = form.data;
		const errors = [];

		const promises = rounds.map(async (round, index) => {
			const response = await createApplication({ contract, round });
			if (!response.ok) {
				errors.push({ round, index });
			}
		});

		await Promise.all(promises);

		if (!errors.length) {
			redirect(303, `/student/${studentId}`);
		}

		const [subj, why] =
			errors.length > 1
				? ['applications', 'they already exist']
				: ['application', 'it already exists'];

		return message(
			form,
			`${errors.length} of the ${rounds.length} ${subj} failed to be created, possibly because ${why}`,
			{
				status: 400
			}
		);
	}
};
