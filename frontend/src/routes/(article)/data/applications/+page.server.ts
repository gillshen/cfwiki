import { fetchApplications, type ApplicationListItem } from '$lib/api/application';

export async function load(_) {
	const applications: Promise<ApplicationListItem[]> = fetchApplications();
	return { applications };
}
