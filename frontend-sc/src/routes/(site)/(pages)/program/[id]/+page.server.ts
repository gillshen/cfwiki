import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { deleteProgram, updateProgram } from '$lib/api/program';
import { programSchema } from '$lib/schemas/program';

import {
	applicationRoundUpdateSchema,
	newApplicationRoundSchema
} from '$lib/schemas/applicationRound';

import {
	createApplicationRound,
	deleteApplicationRound,
	fetchApplicationRounds,
	updateApplicationRound
} from '$lib/api/applicationRound';

import { deleteSchema } from '$lib/schemas/delete';
import { formAction } from '$lib/util/formUtils';

export async function load(event) {
	const { program } = await event.parent();

	return {
		programForm: await superValidate(
			{ ...program, schools: program.schools.map((s) => s.id) },
			zod(programSchema)
		),
		deleteForm: await superValidate(zod(deleteSchema)),
		applicationRounds: fetchApplicationRounds({ program: program.id }),
		newApplicationRoundForm: await superValidate(zod(newApplicationRoundSchema)),
		applicationRoundUpdateForm: await superValidate(zod(applicationRoundUpdateSchema))
	};
}

export const actions = {
	updateProgram: formAction(programSchema, updateProgram),

	deleteProgram: formAction(deleteSchema, deleteProgram, {
		onSuccess: async () => {
			throw redirect(303, '/home');
		}
	}),

	createApplicationRound: formAction(newApplicationRoundSchema, createApplicationRound),
	updateApplicationRound: formAction(applicationRoundUpdateSchema, updateApplicationRound),
	deleteApplicationRound: formAction(deleteSchema, deleteApplicationRound)
};
