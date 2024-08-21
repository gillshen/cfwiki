import { fetchApplications } from '$lib/api/application';

export async function load(_) {
	return {
		applications: fetchApplications({ status: 'pending' })
	};
}
