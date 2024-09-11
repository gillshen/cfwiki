import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	deleteAcademyProduct,
	fetchAcademyProduct,
	updateAcademyProduct
} from '$lib/api/academyProduct';

import { academyProductSchema } from '$lib/schemas/academyProduct';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/abstract/formAction';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid product ID');
	}

	const product = await fetchAcademyProduct(id);

	return {
		product,
		productForm: await superValidate(product, zod(academyProductSchema)),
		deleteForm: await superValidate(product, zod(deleteSchema))
	};
}

export const actions = {
	updateAcademyProduct: formAction(academyProductSchema, updateAcademyProduct),
	deleteAcademyProduct: formAction(deleteSchema, deleteAcademyProduct, () => {
		throw redirect(303, '/cf-academy');
	})
};
