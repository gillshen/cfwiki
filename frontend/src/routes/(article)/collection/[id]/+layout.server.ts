import { error } from '@sveltejs/kit';

import { fetchProgramCollection, type ProgramCollectionDetail } from '$lib/api/programCollection';
import { fetchApplicants, fetchApplications } from '$lib/api/application';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const collection: ProgramCollectionDetail = await fetchProgramCollection(id);

	if (!collection?.id) {
		throw error(404, 'Program collection not found');
	}

	const programIds = collection.programs.map((program) => program.id).join(',');

	return {
		collection,
		applications: fetchApplications({ programs: programIds }),
		applicants: fetchApplicants()
	};
}
