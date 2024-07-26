import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchContract, updateContract } from '$lib/api/contract';
import { contractSchema } from '$lib/schemas/contract';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const contract = await fetchContract(id);

	if (contract?.id === undefined) {
		throw error(404, 'Contract not found');
	}

	const contractForm = await superValidate(contract, zod(contractSchema));

	return { contract, contractForm };
}

export const actions = {
	updateContract: async ({ request }) => {
		const form = await superValidate(request, zod(contractSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Update the contract
		const response = await updateContract(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		// Redirect to the student page
		throw redirect(303, `/student/${form.data.student}`);
	}
};
