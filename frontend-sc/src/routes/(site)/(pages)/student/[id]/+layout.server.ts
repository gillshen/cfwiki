import { fetchStudent } from '$lib/api/student';
import { base10Or400 } from '$lib/util/siteUtils';
import { canEdit } from '$lib/util/studentUtils';

export async function load(event) {
	const id = base10Or400(event.params.id, 'Invalid student ID');
	const { user } = await event.parent();
	const student = await fetchStudent(id);
	const userCanEdit = canEdit({ user, student });

	return {
		student,
		userCanEdit
	};
}
