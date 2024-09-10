import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchContract, type ContractDetail } from '$lib/api/contract';
import { serviceSchema } from '$lib/schemas/service';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/abstract/formAction';
import { createOrUpdateService, deleteService } from '$lib/api/service';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid contract ID');
	}

	const contract: ContractDetail = await fetchContract(id);

	return {
		contract,
		serviceForm: await superValidate(zod(serviceSchema)),
		serviceDeleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	createOrUpdateService: formAction(serviceSchema, createOrUpdateService),
	deleteService: formAction(deleteSchema, deleteService)
};
