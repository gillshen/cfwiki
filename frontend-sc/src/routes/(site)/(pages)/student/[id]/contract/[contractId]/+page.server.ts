import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { contractSchema } from '$lib/schemas/contract';
import { createOrUpdateContract, deleteContract, fetchContract } from '$lib/api/contract';
import { serviceSchema } from '$lib/schemas/service';
import { createOrUpdateService, deleteService } from '$lib/api/service';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';
import { base10Or400 } from '$lib/util/siteUtils';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const id = base10Or400(event.params.contractId, 'Invalid contract ID');

	const contract = await fetchContract(id);

	return {
		contract,
		contractForm: await superValidate(contract, zod(contractSchema)),
		contractDeleteForm: await superValidate(contract, zod(deleteSchema)),
		serviceForm: await superValidate(zod(serviceSchema)),
		serviceDeleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	updateContract: formAction(contractSchema, createOrUpdateContract),

	deleteContract: formAction(deleteSchema, deleteContract, async ({ response }) => {
		const student = await response?.json();
		throw redirect(303, `/student/${student.id}`);
	}),

	createOrUpdateService: formAction(serviceSchema, createOrUpdateService),
	deleteService: formAction(deleteSchema, deleteService)
};
