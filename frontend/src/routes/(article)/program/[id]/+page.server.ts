import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchProgram, updateProgram, type ProgramListItem } from '$lib/api/program';
import { programUpdateSchema } from '$lib/schemas/program';
import { formAction } from '$lib/abstract/formAction';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const program: ProgramListItem = await fetchProgram(id);

	if (program?.id === undefined) {
		throw error(404, 'Program not found');
	}

	const programForm = await superValidate(program, zod(programUpdateSchema));

	return { program, programForm };
}

export const actions = {
	updateProgram: formAction(programUpdateSchema, updateProgram)
};
