import type { PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchApplication, type ApplicationDetail } from '$lib/api/application';
import { roundNameSchema, roundDatesSchema } from '$lib/schemas/applicationRound';
import { newApplicationLogSchema } from '$lib/schemas/applicationLog';
import { formAction } from '$lib/abstract/formAction';
import { updateApplicationRound } from '$lib/api/applicationRound';
import { createOrUpdateApplicationLog } from '$lib/api/applicationLog';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Invalid id');
	}

	const application: ApplicationDetail = await fetchApplication(id);

	if (application?.id === undefined) {
		throw error(404, 'Application not found');
	}

	return {
		application,
		roundRenameForm: await superValidate(application.round, zod(roundNameSchema)),
		datesUpdateForm: await superValidate(application.round, zod(roundDatesSchema)),
		logForm: await superValidate(zod(newApplicationLogSchema))
	};
}

export const actions = {
	updateRoundName: formAction(roundNameSchema, updateApplicationRound),
	updateRoundDates: formAction(roundDatesSchema, updateApplicationRound),
	createOrUpdateApplicationLog: formAction(newApplicationLogSchema, createOrUpdateApplicationLog)
};
