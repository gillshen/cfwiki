import type { PageServerLoadEvent } from './$types';
import { error, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchProgram, updateProgram, type ProgramListItem } from '$lib/api/program';
import { programUpdateSchema } from '$lib/schemas/program';

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
	updateProgram: async ({ request }) => {
		const form = await superValidate(request, zod(programUpdateSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await updateProgram(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		return message(form, 'success');
	}
};
