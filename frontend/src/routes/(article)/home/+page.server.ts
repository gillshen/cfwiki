import { redirect } from '@sveltejs/kit';

import { fetchUser } from '$lib/api/user';
import { fetchStudentsByUser } from '$lib/api/student';
import { fetchApplications } from '$lib/api/application';

export async function load(event) {
	const { username } = await event.parent();

	if (!username) {
		throw redirect(303, '/login');
	}

	const host = await fetchUser(username);

	return {
		host,
		students: fetchStudentsByUser({ cfer: host.id }),
		applications: fetchApplications({ cfer: host.id })
	};
}
