import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchApplication, type ApplicationDetail } from '$lib/api/application';
import { roundNameSchema, roundDatesSchema } from '$lib/schemas/applicationRound';
import { updateRoundDates } from '$lib/api/applicationRound';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const application: ApplicationDetail = await fetchApplication(id);

	if (application?.id === undefined) {
		throw error(404, 'Application not found');
	}

	const renameRoundForm = await superValidate(application.round, zod(roundNameSchema));
	const datesUpdateForm = await superValidate(application.round, zod(roundDatesSchema));

	return { application, renameRoundForm, datesUpdateForm };
}

export const actions = {
	updateDates: async ({ request }) => {
		const form = await superValidate(request, zod(roundDatesSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Update the dates
		const response = await updateRoundDates(form.data);
		if (!response.ok) {
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'success');
	},

	updateRoundName: async ({ request }) => {
		const form = await superValidate(request, zod(roundNameSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		// Update the name
		const response = await updateRoundDates(form.data);
		if (!response.ok) {
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		return message(form, 'success');
	}
};
