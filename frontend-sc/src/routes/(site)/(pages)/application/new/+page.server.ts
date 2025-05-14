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
import { programSchema } from '$lib/schemas/program';
import { newApplicationRoundSchema } from '$lib/schemas/applicationRound';
import { createApplication, fetchComposedApplications } from '$lib/api/application';
import { formAction } from '$lib/util/formUtils';
import { base10Or400 } from '$lib/util/siteUtils';

let token: string | null; // for redirecting

type ApplicationType = 'freshman' | 'transfer' | 'graduate' | 'other';

export async function load({ locals, url }) {
	token = url.searchParams.get('token');

	if (!token) {
		throw error(400, 'Token required');
	}

	let payload: NewApplicationPrepToken;

	try {
		payload = jwt.verify(token, JWT_SECRET_KEY) as NewApplicationPrepToken;
	} catch (err) {
		throw error(400, `Invalid token\n${err}`);
	}

	const { username } = locals.user!;
	if (payload.username !== username) {
		throw error(401, 'Unauthorized');
	}

	const studentId = base10Or400(payload.student, 'Invalid student ID');
	const contractId = base10Or400(payload.contract, 'Invalid contract ID');

	const contract: ContractDetail = await fetchContract(contractId);
	if (contract?.id === undefined) {
		throw error(404, 'Contract not found');
	}

	const year = base10Or400(payload.year, 'Invalid year');
	const applicationType: ApplicationType = getTypeKey(payload.type);

	return {
		studentId,
		contract,
		programType: payload.type,
		year,
		term: payload.term,

		// existing applications
		applications: fetchComposedApplications({
			student: studentId,
			year: year,
			application_type: applicationType
		}),

		// form options
		schools: fetchSchools(applicationType === 'other' ? undefined : { type: 'university' }),
		programs: fetchPrograms({ type: applicationType }),
		applicationRounds: fetchApplicationRounds({
			program_type: applicationType,
			year,
			term: payload.term
		}),

		newSchoolForm: await superValidate(zod(schoolSchema)),
		newProgramForm: await superValidate(zod(programSchema)),
		newApplicationRoundForm: await superValidate(zod(newApplicationRoundSchema)),
		newApplicationForm: await superValidate(zod(applicationSchema))
	};
}

const getTypeKey = (input: string): ApplicationType => {
	switch (input) {
		case 'UG Freshman':
			return 'freshman';
		case 'UG Transfer':
			return 'transfer';
		case 'Graduate':
			return 'graduate';
		case 'Non-degree':
			return 'other';
		default:
			throw error(400, 'Invalid application type');
	}
};

export const actions = {
	createSchool: formAction(schoolSchema, createSchool),

	createProgram: formAction(programSchema, createProgram),

	createApplicationRound: formAction(newApplicationRoundSchema, createApplicationRound),

	createApplication: async ({ request }) => {
		const form = await superValidate(request, zod(applicationSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createApplication({ ...form.data, default_log: 'Started' });

		if (!response.ok) {
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		const url = new URL(request.url);
		url.searchParams.set('token', token!);
		throw redirect(307, url.toString());
	}
};
