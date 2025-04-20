import { fetchProgram, type ProgramDetail } from '$lib/api/program';
import { fetchComposedApplications } from '$lib/api/application';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event) {
	const id = base10Or400(event.params.id, 'Invalid program ID');
	const program: ProgramDetail = await fetchProgram(id);

	return {
		program,
		applications: fetchComposedApplications({ program: program.id })
	};
}
