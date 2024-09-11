import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { createAcademyProduct, fetchAcademyProducts } from '$lib/api/academyProduct';
import { academyProductSchema } from '$lib/schemas/academyProduct';
import { formAction } from '$lib/abstract/formAction';

export async function load(_) {
	return {
		products: fetchAcademyProducts(),
		productForm: await superValidate(zod(academyProductSchema))
	};
}

export const actions = {
	createAcademyProduct: formAction(academyProductSchema, createAcademyProduct)
};
