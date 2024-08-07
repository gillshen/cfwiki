import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchContract, type ContractDetail } from '$lib/api/contract';
import { newServiceSchema } from '$lib/schemas/service';
import { createOrUpdateService } from '$lib/api/service';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const contract: ContractDetail = await fetchContract(id);

	const serviceForm = await superValidate(zod(newServiceSchema));

	return { contract, serviceForm };
}

export const actions = {
	createOrUpdateService: async ({ request }) => {
		const form = await superValidate(request, zod(newServiceSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update service
		const response = await createOrUpdateService(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	}
};
