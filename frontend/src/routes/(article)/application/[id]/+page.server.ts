import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	type ApplicationDetail,
	fetchApplication,
	changeApplicationRound,
	fetchCoApplications,
	deleteApplication
} from '$lib/api/application';

import { roundChangeSchema } from '$lib/schemas/application';
import { roundNameSchema, roundDatesSchema } from '$lib/schemas/applicationRound';
import { applicationLogSchema } from '$lib/schemas/applicationLog';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/abstract/formAction';
import { updateApplicationRound } from '$lib/api/applicationRound';
import { createOrUpdateApplicationLog, deleteApplicationLog } from '$lib/api/applicationLog';

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
		coApplications: fetchCoApplications(application),
		roundChangeForm: await superValidate(zod(roundChangeSchema)),
		roundRenameForm: await superValidate(application.round, zod(roundNameSchema)),
		datesUpdateForm: await superValidate(application.round, zod(roundDatesSchema)),
		deleteForm: await superValidate(zod(deleteSchema)),
		logForm: await superValidate(zod(applicationLogSchema)),
		logDeleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	updateRoundId: formAction(roundChangeSchema, changeApplicationRound),
	updateRoundName: formAction(roundNameSchema, updateApplicationRound),
	updateRoundDates: formAction(roundDatesSchema, updateApplicationRound),

	deleteApplication: formAction(deleteSchema, deleteApplication, (student) => {
		throw redirect(303, `/student/${student.id}`);
	}),

	createOrUpdateApplicationLog: formAction(applicationLogSchema, createOrUpdateApplicationLog),
	deleteApplicationLog: formAction(deleteSchema, deleteApplicationLog)
};
