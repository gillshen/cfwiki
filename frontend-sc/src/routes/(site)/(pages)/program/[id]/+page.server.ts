import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { deleteProgram, updateProgram } from '$lib/api/program';
import { deleteApplicationRound, fetchApplicationRounds } from '$lib/api/applicationRound';
import { programUpdateSchema } from '$lib/schemas/program';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';

export async function load(event) {
	const { program } = await event.parent();

	return {
		programForm: await superValidate(program, zod(programUpdateSchema)),
		deleteForm: await superValidate(zod(deleteSchema)),
		applicationRounds: fetchApplicationRounds({ program: program.id })
	};
}

export const actions = {
	updateProgram: formAction(programUpdateSchema, updateProgram),

	deleteProgram: formAction(deleteSchema, deleteProgram, {
		onSuccess: async () => {
			throw redirect(303, '/home');
		}
	}),

	deleteApplicationRound: formAction(deleteSchema, deleteApplicationRound)
};
