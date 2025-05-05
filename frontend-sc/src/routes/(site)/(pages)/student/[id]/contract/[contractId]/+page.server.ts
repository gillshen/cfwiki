import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { userCanEdit } from '$lib/util/contractUtils';
import { contractSchema } from '$lib/schemas/contract';
import { createOrUpdateContract, deleteContract, fetchContract } from '$lib/api/contract';
import { serviceSchema } from '$lib/schemas/service';
import { createOrUpdateService, deleteService } from '$lib/api/service';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event) {
	const id = base10Or400(event.params.contractId, 'Invalid contract ID');

	const { user } = await event.parent();
	const contract = await fetchContract(id);

	if (!userCanEdit({ user, contract })) {
		throw error(401, 'Unauthorized');
	}

	return {
		contract,
		contractForm: await superValidate(contract, zod(contractSchema)),
		serviceForm: await superValidate(zod(serviceSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
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
