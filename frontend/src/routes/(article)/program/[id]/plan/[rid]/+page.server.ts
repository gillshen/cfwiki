import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchProgram, type ProgramDetail } from '$lib/api/program';
import { roundSchema } from '$lib/schemas/applicationRound';
import { formAction } from '$lib/abstract/formAction';

import {
	fetchApplicationRound,
	updateApplicationRound,
	type ApplicationRoundDetail
} from '$lib/api/applicationRound';

let programId: number;

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid program id');
	}

	const roundId = parseInt(event.params.rid, 10);

	if (isNaN(roundId)) {
		throw error(404, 'Invalid admission plan id');
	}

	const program: ProgramDetail = await fetchProgram(id);

	if (program?.id === undefined) {
		throw error(404, 'Program not found');
	}
	programId = program.id;

	const applicationRound: ApplicationRoundDetail = await fetchApplicationRound(roundId);

	if (applicationRound?.id === undefined) {
		throw error(404, 'Admission plan not found');
	}

	return {
		program,
		roundId: applicationRound.id,
		year: applicationRound.program_iteration.year,
		term: applicationRound.program_iteration.term,
		roundForm: await superValidate(applicationRound, zod(roundSchema))
	};
}

export const actions = {
	updateApplicationRound: formAction(roundSchema, updateApplicationRound, () => {
		throw redirect(303, `/program/${programId}`);
	})
};
