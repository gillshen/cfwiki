import { fetchComposedApplications, type ApplicationType } from '$lib/api/application';

export async function load(_) {
	const applicationType: ApplicationType = 'other';
	return {
		applicationType,
		applications: fetchComposedApplications({ application_type: applicationType })
	};
}
