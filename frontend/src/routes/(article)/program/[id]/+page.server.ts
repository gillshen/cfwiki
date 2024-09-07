import { redirect } from '@sveltejs/kit';

import { deleteProgram, updateProgram } from '$lib/api/program';
import { deleteApplicationRound } from '$lib/api/applicationRound';
import { programUpdateSchema } from '$lib/schemas/program';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/abstract/formAction';

export const actions = {
	updateProgram: formAction(programUpdateSchema, updateProgram),

	deleteProgram: formAction(deleteSchema, deleteProgram, () => {
		throw redirect(303, '/home');
	}),

	deleteApplicationRound: formAction(deleteSchema, deleteApplicationRound)
};
