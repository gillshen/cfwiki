import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { contractSchema } from '$lib/schemas/contract';
import { formAction } from '$lib/util/formUtils';
import { createOrUpdateContract } from '$lib/api/contract';

export async function load() {
	return {
		newContractForm: await superValidate(zod(contractSchema))
	};
}

export const actions = {
	createContract: formAction(contractSchema, createOrUpdateContract, {
		onSuccess: async ({ response }) => {
			const newContract = await response?.json();
			throw redirect(303, `/student/${newContract.student}/contract/${newContract.id}`);
		}
	})
};
