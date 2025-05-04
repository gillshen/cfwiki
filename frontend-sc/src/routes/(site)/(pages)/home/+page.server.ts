import { redirect } from '@sveltejs/kit';

import { fetchComposedApplications } from '$lib/api/application';

export async function load(event) {
	const { username } = await event.parent();

	if (!username) {
		throw redirect(303, '/login');
	}

	return {
		applications: fetchComposedApplications({ cfer: username })
	};
}
