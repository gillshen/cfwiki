import { fetchStudent } from '$lib/api/student';
import { base10Or400 } from '$lib/util/siteUtils';
import { canEdit, canCreateApplications } from '$lib/util/studentUtils';

export async function load(event) {
	const id = base10Or400(event.params.id, 'Invalid student ID');
	const { user } = await event.parent();
	const student = await fetchStudent(id);

	return {
		student,
		userCanEdit: canEdit({ user, student }),
		canCreateApplications: canCreateApplications(student)
	};
}
