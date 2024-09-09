import { error } from '@sveltejs/kit';

import { fetchProgram, type ProgramDetail } from '$lib/api/program';
import { fetchApplicants, fetchApplications } from '$lib/api/application';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const program: ProgramDetail = await fetchProgram(id);

	if (program?.id === undefined) {
		throw error(404, 'Program not found');
	}

	return {
		program,
		applications: fetchApplications({ program: program.id }),
		applicants: fetchApplicants()
	};
}
