import { error } from '@sveltejs/kit';

import { fetchSchool, type School } from '$lib/api/school';
import { fetchComposedApplications } from '$lib/api/application';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid school ID');
	}

	const school: School = await fetchSchool(id);

	return {
		school,
		applications: school.type === 'Secondary School'? fetchComposedApplications({ school_attended: school.id }): fetchComposedApplications({ school: school.id })
	};
}
