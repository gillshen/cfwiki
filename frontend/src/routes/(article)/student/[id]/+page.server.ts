import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchStudent, type StudentDetail } from '$lib/api/student';
import { fetchSchools, type School } from '$lib/api/school';
import { newContractSchema } from '$lib/schemas/contract';
import { newEnrollmentSchema } from '$lib/schemas/enrollment';
import {
	newToeflSchema,
	newIeltschema,
	newSatSchema,
	newActSchema,
	newGreSchema
} from '$lib/schemas/scores';
import { createOrUpdateContract } from '$lib/api/contract';
import { createOrUpdateEnrollment } from '$lib/api/enrollment';
import {
	createOrUpdateToeflScore,
	createOrUpdateSatScore,
	createOrUpdateActScore,
	createOrUpdateIeltsScore,
	createOrUpdateGreScore
} from '$lib/api/scores';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const student: StudentDetail = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Student not found');
	}

	const contractForm = await superValidate(zod(newContractSchema));
	const enrollmentForm = await superValidate(zod(newEnrollmentSchema));
	const toeflForm = await superValidate(zod(newToeflSchema));
	const ieltsForm = await superValidate(zod(newIeltschema));
	const satScoreForm = await superValidate(zod(newSatSchema));
	const actScoreForm = await superValidate(zod(newActSchema));
	const greScoreForm = await superValidate(zod(newGreSchema));

	return {
		student,
		contractForm,
		enrollmentForm,
		toeflForm,
		ieltsForm,
		satScoreForm,
		actScoreForm,
		greScoreForm
	};
}

export const actions = {
	createOrUpdateContract: async ({ request }) => {
		const form = await superValidate(request, zod(newContractSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update the contract
		const response = await createOrUpdateContract(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	},

	createOrUpdateEnrollment: async ({ request }) => {
		const form = await superValidate(request, zod(newEnrollmentSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update the enrollment
		const response = await createOrUpdateEnrollment(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	},

	createOrUpdateToeflScore: async ({ request }) => {
		const form = await superValidate(request, zod(newToeflSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update TOEFL score
		const response = await createOrUpdateToeflScore(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	},

	createOrUpdateIeltsScore: async ({ request }) => {
		const form = await superValidate(request, zod(newIeltschema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update IELTS score
		const response = await createOrUpdateIeltsScore(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	},

	createOrUpdateSatScore: async ({ request }) => {
		const form = await superValidate(request, zod(newSatSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update SAT score
		const response = await createOrUpdateSatScore(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	},

	createOrUpdateActScore: async ({ request }) => {
		const form = await superValidate(request, zod(newActSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update ACT score
		const response = await createOrUpdateActScore(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	},

	createOrUpdateGreScore: async ({ request }) => {
		const form = await superValidate(request, zod(newGreSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Create/update GRE score
		const response = await createOrUpdateGreScore(form.data);
		if (!response.ok) {
			console.log(response);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'Success');
	}
};
