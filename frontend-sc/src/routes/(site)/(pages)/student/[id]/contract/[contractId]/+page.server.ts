import type { PageServerLoadEvent } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchContract } from '$lib/api/contract';
import { serviceSchema } from '$lib/schemas/service';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';
import { createOrUpdateService, deleteService } from '$lib/api/service';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event: PageServerLoadEvent) {
	const id = base10Or400(event.params.contractId, 'Invalid contract ID');

	return {
		contract: await fetchContract(id),
		serviceForm: await superValidate(zod(serviceSchema)),
		serviceDeleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	createOrUpdateService: formAction(serviceSchema, createOrUpdateService),
	deleteService: formAction(deleteSchema, deleteService)
};
