import type { PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import {
	type ApplicationDetail,
	fetchApplication,
	fetchCoApplications,
	updateApplication,
	deleteApplication
} from '$lib/api/application';

import {
	commentsUpdateSchema,
	majorsUpdateSchema,
	roundChangeSchema
} from '$lib/schemas/application';

import { fetchApplicationRounds } from '$lib/api/applicationRound';
import { applicationLogSchema } from '$lib/schemas/applicationLog';
import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/abstract/formAction';
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
		promisedRounds: fetchApplicationRounds(application.program.id),
		coApplications: fetchCoApplications(application),
		roundChangeForm: await superValidate(zod(roundChangeSchema)),
		majorsUpdateForm: await superValidate(zod(majorsUpdateSchema)),
		commentsUpdateForm: await superValidate(zod(commentsUpdateSchema)),
		logForm: await superValidate(zod(applicationLogSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	updateRoundId: formAction(roundChangeSchema, updateApplication),
	updateMajors: formAction(majorsUpdateSchema, updateApplication),
	updateComments: formAction(commentsUpdateSchema, updateApplication),

	deleteApplication: formAction(deleteSchema, deleteApplication, (student) => {
		throw redirect(303, `/student/${student.id}`);
	}),

	createOrUpdateApplicationLog: formAction(applicationLogSchema, createOrUpdateApplicationLog),
	deleteApplicationLog: formAction(deleteSchema, deleteApplicationLog)
};
