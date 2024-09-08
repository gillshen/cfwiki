import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { formAction } from '$lib/abstract/formAction';
import { deleteProgramCollection } from '$lib/api/programCollection';
import { deleteSchema } from '$lib/schemas/delete';

export async function load(_) {
	return { deleteForm: await superValidate(zod(deleteSchema)) };
}

export const actions = {
	deleteProgramCollection: formAction(deleteSchema, deleteProgramCollection, () => {
		throw redirect(303, '/collection/index');
	})
};
