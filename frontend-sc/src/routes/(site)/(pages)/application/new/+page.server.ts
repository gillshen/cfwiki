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
import { applicationSchema, type NewApplicationPrepToken } from '$lib/schemas/application';
import { newProgramSchema } from '$lib/schemas/program';
import { roundSchema } from '$lib/schemas/applicationRound';
import { createApplication, fetchComposedApplications } from '$lib/api/application';
import { formAction } from '$lib/util/formUtils';

let token: string | null; // for redirecting

export async function load(event: PageServerLoadEvent) {
	token = event.url.searchParams.get('token');

	if (!token) {
		throw error(400, 'Token required');
	}

	let payload: NewApplicationPrepToken

	try {
		payload = jwt.verify(token, JWT_SECRET_KEY) as NewApplicationPrepToken
	} catch (err) {
		throw error(400, 'Invalid token');
	}
	
	const { username } = await event.parent()
	if (payload.username !== username) {
		throw error(401, 'Unauthorized');
	}

	const studentId = parseInt(payload.student ?? '', 10);
	if (isNaN(studentId)) {
		throw error(400, 'Invalid student ID')
	}

	const contractId = parseInt(payload.contract ?? '', 10);
	if (isNaN(contractId)) {
		throw error(400, 'Invalid contract ID')
	}

	const contract: ContractDetail = await fetchContract(contractId);
	if (contract?.id === undefined) {
		throw error(404, 'Contract not found');
	}

	const year = parseInt(payload.year ?? '', 10);
	if (isNaN(year)) {
		throw error(400, 'Invalid year')
	}

	let programTypeKey: 'freshman'|'transfer'|'graduate'|'other'

	switch(payload.type) {
		case 'UG Freshman':
			programTypeKey = 'freshman'
			break
		case 'UG Transfer':
			programTypeKey = 'transfer';
			break
		case 'Graduate':
			programTypeKey = 'graduate'
			break
		case 'Non-degree':
			programTypeKey = 'other'
			break
		default:
			throw error(400, 'Invalid program type')
	}

	return {
		studentId,
		contract,
		programType: payload.type,
		year,
		term: payload.term,
		applications: fetchComposedApplications({student: studentId, year: year, application_type: payload.type}),
		schools: payload.type === 'Non-degree' ? fetchSchools() : fetchSchools({ type: 'university' }),
		programs: fetchPrograms({ type: programTypeKey }),
		applicationRounds: fetchApplicationRounds({ program_type: payload.type, year, term: payload.term }),
		newSchoolForm: await superValidate(zod(schoolSchema)),
		newProgramForm: await superValidate(zod(newProgramSchema)),
		newApplicationForm: await superValidate(zod(applicationSchema)),
		newApplicationRoundForm: await superValidate(zod(roundSchema))
	};
	
}

export const actions = {
	createSchool: formAction(schoolSchema, createSchool),

	createProgram: formAction(newProgramSchema, createProgram),

	createApplicationRound: formAction(roundSchema, createApplicationRound),

	createApplication: async ({ request }) => {
		const form = await superValidate(request, zod(applicationSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createApplication({...form.data, default_log: 'Started'});

		if (!response.ok) {
			return message(form, 'Sorry, an error occurred', { status: 400 }); 
		}
		throw redirect(302, `/application/new?token=${token}`)
	}
};
