import { error } from '@sveltejs/kit';

import { fetchProgram, type ProgramDetail } from '$lib/api/program';
import { fetchComposedApplications } from '$lib/api/application';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid program ID');
	}

	const program: ProgramDetail = await fetchProgram(id);

	return {
		program,
		applications: fetchComposedApplications({ program: program.id })
	};
}
