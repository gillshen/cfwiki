import { fetchApplications, type ApplicationListItem } from '$lib/api/application.js';

export async function load(_) {
	const applications: Promise<ApplicationListItem[]> = fetchApplications();
	return { applications };
}
