import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPasswordSchema } from '$lib/schemas/user';
import { updatePassword } from '$lib/api/user';
import { deleteCookies } from '$lib/api/auth';

export async function load({ locals }) {
	// TODO get username from locals
	const { username } = locals.user!;
	const passwordSchema = createPasswordSchema(username);

	return {
		passwordForm: await superValidate(zod(passwordSchema))
	};
}

export const actions = {
	updatePassword: async ({ locals, request, cookies }) => {
		// TODO get username from locals
		const username = locals.user!.username;
		const passwordSchema = createPasswordSchema(username);
		const form = await superValidate(request, zod(passwordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await updatePassword(form.data);

		if (!response.ok) {
			console.log(response.status, response.statusText);
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}
		deleteCookies(cookies);
	}
};
