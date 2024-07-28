import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { fetchApplication, type ApplicationDetail } from '$lib/api/application';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const application: ApplicationDetail = await fetchApplication(id);

	if (application?.id === undefined) {
		throw error(404, 'Application not found');
	}

	return { application };
}
