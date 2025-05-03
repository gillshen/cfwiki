import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { passwordResetSchema } from '$lib/schemas/user';
import { updatePassword } from '$lib/api/user';
import { formAction } from '$lib/util/formUtils';
import { logout } from '$lib/util/userUtils';

export async function load() {
	return { passwordResetForm: await superValidate(zod(passwordResetSchema)) };
}

export const actions = {
	updatePassword: formAction(passwordResetSchema, updatePassword, async ({ event }) =>
		logout(event!.cookies)
	)
};
