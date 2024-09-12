import { fetchComposedApplications, type ApplicationType } from '$lib/api/application';

export async function load(_) {
	const applicationType: ApplicationType = 'freshman';
	return {
		applicationType,
		applications: fetchComposedApplications({ application_type: applicationType })
	};
}
