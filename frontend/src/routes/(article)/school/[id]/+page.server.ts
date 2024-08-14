import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchSchool, updateSchool, type School } from '$lib/api/school';
import { fetchApplications } from '$lib/api/application';
import { schoolSchema } from '$lib/schemas/school';
import { formAction } from '$lib/abstract/formAction';
import { fetchEnrollments } from '$lib/api/enrollment';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const school: School = await fetchSchool(id);

	if (school?.id === undefined) {
		throw error(404, 'School not found');
	}

	return {
		school,
		schoolForm: await superValidate(school, zod(schoolSchema)),
		applications: fetchApplications({ school: school.id }),
		enrollments: fetchEnrollments({ school: school.id })
	};
}

export const actions = {
	updateSchool: formAction(schoolSchema, updateSchool)
};
