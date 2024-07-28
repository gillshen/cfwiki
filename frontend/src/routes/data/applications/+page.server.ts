import { fetchApplications, type ApplicationListItem } from '$lib/api/application.js';

export async function load(event) {
	const applications: ApplicationListItem[] = await fetchApplications();
	return { applications };
}
