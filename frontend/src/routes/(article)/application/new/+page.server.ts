import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';
import { fetchContract, type ContractDetail } from '$lib/api/contract';
import { fetchProgram, type ProgramListItem } from '$lib/api/program';

import {
	createApplicationRound,
	fetchApplicationRounds,
	type ApplicationRoundListItem
} from '$lib/api/applicationRound';

import { newApplicationSchema } from '$lib/schemas/application';
import { roundSchema } from '$lib/schemas/applicationRound';
import { createApplication } from '$lib/api/application';
import { formAction } from '$lib/abstract/formAction';

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

		const contract: ContractDetail = await fetchContract(contractId);
		if (contract?.id === undefined) {
			throw error(404, 'Contract not found');
		}

		const program: ProgramListItem = await fetchProgram(programId);
		if (program?.id === undefined) {
			throw error(404, 'Program not found');
		}

		const applicationRounds: ApplicationRoundListItem[] = await fetchApplicationRounds(programId);

		const newApplicationForm = await superValidate(zod(newApplicationSchema));
		const newApplicationRoundForm = await superValidate(zod(roundSchema));

		return {
			contract,
			program,
			applicationRounds,
			newApplicationForm,
			newApplicationRoundForm
		};
	} catch (err) {
		throw error(400, 'Invalid token');
	}
};

export const actions = {
	createApplicationRound: formAction(roundSchema, createApplicationRound),

	createApplication: formAction(newApplicationSchema, createApplication, (newApplication) => {
		throw redirect(303, `/application/${newApplication.id}`);
	})
};
