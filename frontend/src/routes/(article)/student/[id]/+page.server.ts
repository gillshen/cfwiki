import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchStudent, type StudentListItem } from '$lib/api/student';
import { newContractSchema } from '$lib/schemas/contract';
import { createOrUpdateContract } from '$lib/api/contract';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const student: StudentListItem = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Student not found');
	}

	const contractForm = await superValidate(zod(newContractSchema));

	return { student, contractForm };
}

export const actions = {
	createOrUpdateContract: async ({ request }) => {
		const form = await superValidate(request, zod(newContractSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update the contract
		const response = await createOrUpdateContract(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	}
};
