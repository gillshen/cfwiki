import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { updateStudent } from '$lib/api/student';
import { createAcademyProgram, fetchAcademyPrograms } from '$lib/api/academyProgram';
import { studentAcamdeyProgramSchema } from '$lib/schemas/student';
import { academyProgramSchema } from '$lib/schemas/academyProgram';
import { formAction } from '$lib/abstract/formAction';

export async function load(event) {
	const { student } = await event.parent();

	const formEntity = {
		id: student.id,
		cf_academy_programs: student.cf_academy_programs.map((p) => p.id)
	};

	return {
		programs: fetchAcademyPrograms(),
		programsUpdateForm: await superValidate(formEntity, zod(studentAcamdeyProgramSchema)),
		newProgramForm: await superValidate(zod(academyProgramSchema))
	};
}

export const actions = {
	updateStudentAcademyPrograms: formAction(
		studentAcamdeyProgramSchema,
		updateStudent,
		(student) => {
			throw redirect(303, `/student/${student.id}`);
		}
	),
	createAcademyProgram: formAction(academyProgramSchema, createAcademyProgram)
};
