import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	deleteAcademyProgram,
	fetchAcademyProgram,
	updateAcademyProgam
} from '$lib/api/academyProgram';

import { academyProgramSchema } from '$lib/schemas/academyProgram';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/abstract/formAction';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid program ID');
	}

	const program = await fetchAcademyProgram(id);

	return {
		program,
		programForm: await superValidate(program, zod(academyProgramSchema)),
		deleteForm: await superValidate(program, zod(deleteSchema))
	};
}

export const actions = {
	updateAcademyProgram: formAction(academyProgramSchema, updateAcademyProgam),
	deleteAcademyProgram: formAction(deleteSchema, deleteAcademyProgram, () => {
		throw redirect(303, '/cf-academy');
	})
};
