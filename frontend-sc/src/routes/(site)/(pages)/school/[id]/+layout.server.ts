import { fetchSchool, type School } from '$lib/api/school';
import { fetchComposedApplications } from '$lib/api/application';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event) {
	const id = base10Or400(event.params.id, 'Invalid school ID');
	const school: School = await fetchSchool(id);

	return {
		school,
		applications: fetchComposedApplications(
			school.type === 'Secondary School' ? { school_attended: school.id } : { school: school.id }
		)
	};
}
