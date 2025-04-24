import { redirect } from '@sveltejs/kit';

import { fetchUser } from '$lib/api/user';
import { fetchComposedApplications } from '$lib/api/application';

export async function load(event) {
	const { username } = await event.parent();

	if (!username) {
		throw redirect(303, '/login');
	}

	const host = await fetchUser(username);

	return {
		host,
		applications: fetchComposedApplications({ cfer: host.username })
	};
}
