import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchSchools } from '$lib/api/school';
import { fetchPrograms } from '$lib/api/program';
import { collectionSchema } from '$lib/schemas/programCollection';
import { updateProgramCollection } from '$lib/api/programCollection';
import { formAction } from '$lib/abstract/formAction';

export async function load(event) {
	const { collection } = await event.parent();
	const formData = { ...collection, programs: collection.programs.map((p) => p.id) };

	return {
		schools: fetchSchools(),
		programs: fetchPrograms(),
		collectionForm: await superValidate(formData, zod(collectionSchema))
	};
}

export const actions = {
	updateProgramCollection: formAction(collectionSchema, updateProgramCollection, (collection) => {
		throw redirect(303, `/collection/${collection.id}`);
	})
};
