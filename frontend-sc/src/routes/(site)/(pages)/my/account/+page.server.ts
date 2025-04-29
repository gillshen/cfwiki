import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userUpdateSchema } from '$lib/schemas/user';
import { updateUser } from '$lib/api/user';
import { formAction } from '$lib/util/formUtils';

export async function load(event) {
	const { user } = await event.parent();
	return { userUpdateForm: await superValidate(user, zod(userUpdateSchema)) };
}

export const actions = {
	updateUser: formAction(userUpdateSchema, updateUser)
};
