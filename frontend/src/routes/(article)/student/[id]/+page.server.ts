import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchStudent, type StudentListItem } from '$lib/api/student';
import { newContractSchema } from '$lib/schemas/contract';
import { createContract } from '$lib/api/contract';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const student: StudentListItem = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Student not found');
	}

	const newContractForm = await superValidate(zod(newContractSchema));

	return { student, newContractForm };
}

export const actions = {
	createContract: async ({ request }) => {
		const form = await superValidate(request, zod(newContractSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createContract(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	}
};
