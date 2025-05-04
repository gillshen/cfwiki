import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { deleteSchool } from '$lib/api/school';
import { fetchPrograms } from '$lib/api/program';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';
import { fetchEnrollments } from '$lib/api/enrollment';

export async function load(event) {
	const { school } = await event.parent();

	return {
		programs: fetchPrograms({ school: school.id }),
		enrollments: fetchEnrollments({ school: school.id }),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	deleteSchool: formAction(deleteSchema, deleteSchool, async () => {
		throw redirect(303, '/home');
	})
};
