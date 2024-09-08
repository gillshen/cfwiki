import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { collectionSchema } from '$lib/schemas/programCollection';
import { fetchSchools } from '$lib/api/school';
import { fetchPrograms } from '$lib/api/program';
import { createProgramCollection } from '$lib/api/programCollection';
import { formAction } from '$lib/abstract/formAction';

export async function load(_) {
	return {
		schools: fetchSchools(),
		programs: fetchPrograms(),
		collectionForm: await superValidate(zod(collectionSchema))
	};
}

export const actions = {
	createProgramCollection: formAction(
		collectionSchema,
		createProgramCollection,
		(newCollection) => {
			throw redirect(303, `/collection/${newCollection.id}`);
		}
	)
};
