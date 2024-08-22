import { fetchApplications } from '$lib/api/application';

export async function load(_) {
	return {
		pending: true,
		applications: fetchApplications({ status: 'pending' })
	};
}
