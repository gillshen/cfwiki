import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { createAcademyProgram, fetchAcademyPrograms } from '$lib/api/academyProgram';
import { academyProgramSchema } from '$lib/schemas/academyProgram';
import { formAction } from '$lib/abstract/formAction';

export async function load(_) {
	return {
		programs: fetchAcademyPrograms(),
		programForm: await superValidate(zod(academyProgramSchema))
	};
}

export const actions = {
	createAcademyProgram: formAction(academyProgramSchema, createAcademyProgram)
};
