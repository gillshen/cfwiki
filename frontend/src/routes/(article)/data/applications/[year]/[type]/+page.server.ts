import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';

import {
	applicationTypes,
	fetchApplicants,
	fetchApplications,
	type ApplicationType
} from '$lib/api/application';

export async function load(event: PageServerLoadEvent) {
	const year = parseInt(event.params.year, 10);

	if (isNaN(year)) {
		throw error(404, 'Invalid year');
	}

	const applicationType = event.params.type;

	if (!applicationTypes.includes(applicationType as ApplicationType)) {
		throw error(404, 'Invalid application type');
	}

	return {
		year,
		applicationType,
		applications: fetchApplications({ year, application_type: applicationType }),
		applicants: fetchApplicants()
	};
}
