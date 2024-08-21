import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchProgram, type ProgramDetail } from '$lib/api/program';
import { newRoundSchema } from '$lib/schemas/applicationRound';
import { createApplicationRound } from '$lib/api/applicationRound';
import { formAction } from '$lib/abstract/formAction';
import { academicTerms } from '$lib/constants/progressions';

let applicationId: string;

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const program: ProgramDetail = await fetchProgram(id);

	if (program?.id === undefined) {
		throw error(404, 'Program not found');
	}

	const yearString = event.url.searchParams.get('year');

	if (!yearString) {
		throw error(404, 'Invalid year');
	}

	const year = parseInt(yearString, 10);

	if (isNaN(year)) {
		throw error(404, 'Invalid year');
	}

	const term = event.url.searchParams.get('term');
	applicationId = event.url.searchParams.get('application')!;

	if (!term || !academicTerms.includes(term)) {
		throw error(404, 'Invalid term');
	}

	return {
		program,
		year,
		term,
		roundForm: await superValidate(zod(newRoundSchema))
	};
}

export const actions = {
	createApplicationRound: formAction(newRoundSchema, createApplicationRound, () => {
		throw redirect(303, `/application/${applicationId}`);
	})
};
