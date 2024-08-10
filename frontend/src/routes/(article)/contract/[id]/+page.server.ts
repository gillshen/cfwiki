import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchContract, type ContractDetail } from '$lib/api/contract';
import { serviceSchema } from '$lib/schemas/service';
import { formAction } from '$lib/abstract/formAction';
import { createOrUpdateService } from '$lib/api/service';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const contract: ContractDetail = await fetchContract(id);

	if (!contract?.id) {
		throw error(404, 'Contract not found');
	}

	const serviceForm = await superValidate(zod(serviceSchema));

	return { contract, serviceForm };
}

export const actions = {
	createOrUpdateService: formAction(serviceSchema, createOrUpdateService)
};
