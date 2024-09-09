import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	deleteSchool,
	fetchApplicationStats,
	fetchSchool,
	updateSchool,
	type School
} from '$lib/api/school';

import { fetchPrograms } from '$lib/api/program';
import { fetchApplicants, fetchApplications } from '$lib/api/application';
import { schoolSchema } from '$lib/schemas/school';
import { deleteSchema } from '$lib/schemas/delete';
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

	let applications;

	if (school.type === 'Secondary School') {
		applications = fetchApplications({ school_attended: school.id });
	} else {
		applications = fetchApplications({ school: school.id });
	}

	return {
		school,
		programs: fetchPrograms({ school: school.id }),
		stats: fetchApplicationStats({ school_id: school.id }),
		schoolForm: await superValidate(school, zod(schoolSchema)),
		deleteForm: await superValidate(zod(deleteSchema)),
		applications,
		applicants: fetchApplicants(),
		enrollments: fetchEnrollments({ school: school.id })
	};
}

export const actions = {
	updateSchool: formAction(schoolSchema, updateSchool),

	deleteSchool: formAction(deleteSchema, deleteSchool, () => {
		throw redirect(303, '/home');
	})
};
