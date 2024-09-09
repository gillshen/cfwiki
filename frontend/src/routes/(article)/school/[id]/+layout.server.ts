import { error } from '@sveltejs/kit';

import { fetchSchool, type School } from '$lib/api/school';
import { fetchApplicants, fetchApplications } from '$lib/api/application';

export async function load(event) {
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
		applications,
		applicants: fetchApplicants()
	};
}
