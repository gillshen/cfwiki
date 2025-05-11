import { fetchComposedApplications } from '$lib/api/application';

export async function load({ locals }) {
	const { username } = locals.user!;

	return {
		applications: fetchComposedApplications({ cfer: username })
	};
}
