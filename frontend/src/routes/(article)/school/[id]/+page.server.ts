import type { PageServerLoadEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { deleteSchool, updateSchool } from '$lib/api/school';
import { fetchPrograms } from '$lib/api/program';
import { schoolSchema } from '$lib/schemas/school';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/abstract/formAction';
import { fetchEnrollments } from '$lib/api/enrollment';

export async function load(event: PageServerLoadEvent) {
	const { school } = await event.parent();

	return {
		programs: fetchPrograms({ school: school.id }),
		enrollments: fetchEnrollments({ school: school.id }),
		schoolForm: await superValidate(school, zod(schoolSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	updateSchool: formAction(schoolSchema, updateSchool),

	deleteSchool: formAction(deleteSchema, deleteSchool, () => {
		throw redirect(303, '/home');
	})
};
