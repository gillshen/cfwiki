import { fetchComposedApplications } from '$lib/api/application';

export async function load(_) {
	return {
		pending: true,
		applications: fetchComposedApplications({ status: 'pending' })
	};
}
