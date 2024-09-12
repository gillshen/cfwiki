import { fetchComposedApplications, type ApplicationType } from '$lib/api/application';

export async function load(_) {
	const applicationType: ApplicationType = 'transfer';
	return {
		applicationType,
		applications: fetchComposedApplications({ application_type: applicationType })
	};
}
