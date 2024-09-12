import { fetchComposedApplications } from '$lib/api/application';

export async function load(_) {
	return { applications: fetchComposedApplications() };
}
