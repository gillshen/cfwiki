import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchApplicationStats, fetchProgram, type ProgramDetail } from '$lib/api/program';

import { fetchApplicants, fetchApplications } from '$lib/api/application';
import { fetchApplicationRounds } from '$lib/api/applicationRound';
import { programUpdateSchema } from '$lib/schemas/program';
import { deleteSchema } from '$lib/schemas/delete';

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
		statsItems: fetchApplicationStats({ program_id: program.id }),
		programForm: await superValidate(program, zod(programUpdateSchema)),
		deleteForm: await superValidate(zod(deleteSchema)),
		applicationRounds: fetchApplicationRounds({ program: program.id }),
		applications: fetchApplications({ program: program.id }),
		applicants: fetchApplicants()
	};
}
