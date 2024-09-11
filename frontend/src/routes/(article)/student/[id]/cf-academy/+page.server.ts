import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { updateStudent } from '$lib/api/student';
import { createAcademyProduct, fetchAcademyProducts } from '$lib/api/academyProduct';
import { studentAcamdeyProductSchema } from '$lib/schemas/student';
import { academyProductSchema } from '$lib/schemas/academyProduct';
import { formAction } from '$lib/abstract/formAction';

export async function load(event) {
	const { student } = await event.parent();

	const formEntity = {
		id: student.id,
		academy_products: student.academy_products.map((p) => p.id)
	};

	return {
		products: fetchAcademyProducts(),
		productsUpdateForm: await superValidate(formEntity, zod(studentAcamdeyProductSchema)),
		newProductForm: await superValidate(zod(academyProductSchema))
	};
}

export const actions = {
	updateStudentAcademyProducts: formAction(
		studentAcamdeyProductSchema,
		updateStudent,
		(student) => {
			throw redirect(303, `/student/${student.id}`);
		}
	),
	createAcademyProduct: formAction(academyProductSchema, createAcademyProduct)
};
