import type { PageServerLoadEvent } from './$types';
import { redirect } from '@sveltejs/kit';
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
import { formAction } from '$lib/util/formUtils';
import { createOrUpdateApplicationLog, deleteApplicationLog } from '$lib/api/applicationLog';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event: PageServerLoadEvent) {
	const id = base10Or400(event.params.id, 'Invalid application ID');
	const application: ApplicationDetail = await fetchApplication(id);

	return {
		application,
		promisedRounds: fetchApplicationRounds({ program: application.program.id }),
		coApplications: fetchCoApplications(application),
		roundChangeForm: await superValidate(zod(roundChangeSchema)),
		majorsUpdateForm: await superValidate(zod(majorsUpdateSchema)),
		commentsUpdateForm: await superValidate(zod(commentsUpdateSchema)),
		logForm: await superValidate(zod(applicationLogSchema)),
		deleteForm: await superValidate(application, zod(deleteSchema))
	};
}

export const actions = {
	updateRoundId: formAction(roundChangeSchema, updateApplication),
	updateMajors: formAction(majorsUpdateSchema, updateApplication),
	updateComments: formAction(commentsUpdateSchema, updateApplication),

	deleteApplication: formAction(deleteSchema, deleteApplication, async ({ response }) => {
		const student = await response?.json();
		throw redirect(303, `/student/${student.id}`);
	}),

	createOrUpdateApplicationLog: formAction(applicationLogSchema, createOrUpdateApplicationLog),
	deleteApplicationLog: formAction(deleteSchema, deleteApplicationLog)
};
