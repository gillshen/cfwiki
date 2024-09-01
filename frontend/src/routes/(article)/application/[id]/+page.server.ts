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
	trackUpdateSchema,
	roundChangeSchema
} from '$lib/schemas/application';

import { fetchStaffList } from '$lib/api/student';
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

	const staffList = (await fetchStaffList(application.student.id)).staff_names;

	return {
		application,
		staffList,
		promisedRounds: fetchApplicationRounds({ program: application.program.id }),
		coApplications: fetchCoApplications(application),
		roundChangeForm: await superValidate(zod(roundChangeSchema)),
		majorsUpdateForm: await superValidate(zod(majorsUpdateSchema)),
		trackUpdateForm: await superValidate(zod(trackUpdateSchema)),
		commentsUpdateForm: await superValidate(zod(commentsUpdateSchema)),
		logForm: await superValidate(zod(applicationLogSchema)),
		deleteForm: await superValidate(zod(deleteSchema))
	};
}

export const actions = {
	updateRoundId: formAction(roundChangeSchema, updateApplication),
	updateMajors: formAction(majorsUpdateSchema, updateApplication),
	updateTrack: formAction(trackUpdateSchema, updateApplication),
	updateComments: formAction(commentsUpdateSchema, updateApplication),

	deleteApplication: formAction(deleteSchema, deleteApplication, (student) => {
		throw redirect(303, `/student/${student.id}`);
	}),

	createOrUpdateApplicationLog: formAction(applicationLogSchema, createOrUpdateApplicationLog),
	deleteApplicationLog: formAction(deleteSchema, deleteApplicationLog)
};
