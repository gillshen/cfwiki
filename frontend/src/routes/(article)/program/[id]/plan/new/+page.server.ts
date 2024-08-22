import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchProgram, type ProgramDetail } from '$lib/api/program';
import { roundSchema } from '$lib/schemas/applicationRound';
import { formAction } from '$lib/abstract/formAction';
import { createApplicationRound } from '$lib/api/applicationRound';

let programId: number;
let applicationId: string | null;

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid program id');
	}

	const program: ProgramDetail = await fetchProgram(id);

	if (program?.id === undefined) {
		throw error(404, 'Program not found');
	}

	programId = program.id;
	applicationId = event.url.searchParams.get('application');
	const term = event.url.searchParams.get('term') ?? null;
	const year = parseInt(event.url.searchParams.get('year') ?? '', 10) || null;

	return {
		program,
		year,
		term,
		roundForm: await superValidate(zod(roundSchema))
	};
}

export const actions = {
	createApplicationRound: formAction(roundSchema, createApplicationRound, () => {
		if (applicationId) {
			throw redirect(303, `/application/${applicationId}`);
		} else {
			throw redirect(303, `/program/${programId}`);
		}
	})
};
