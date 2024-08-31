import { redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { fetchUser, updateUser, updatePassword } from '$lib/api/user';
import { userUpdateSchema, passwordResetSchema } from '$lib/schemas/user';
import { formAction } from '$lib/abstract/formAction';

import {
	logout,
	passwordHasDigitOrSpecial,
	passwordHasLower,
	passwordHasUpper,
	passwordHasUsername,
	passwordLongEnough
} from '$lib/utils/userUtils';

let _username: string;

export async function load(event) {
	const { username } = await event.parent();

	if (!username) {
		throw redirect(303, '/login');
	}
	const user = await fetchUser(username);
	_username = username;

	return {
		user,
		userForm: await superValidate(user, zod(userUpdateSchema)),
		passwordForm: await superValidate(user, zod(passwordResetSchema))
	};
}

export const actions = {
	updateUser: formAction(userUpdateSchema, updateUser),

	updatePassword: async (event) => {
		const form = await superValidate(event, zod(passwordResetSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { password } = form.data;
		if (
			!passwordLongEnough(password) ||
			!passwordHasUpper(password) ||
			!passwordHasLower(password) ||
			!passwordHasDigitOrSpecial(password) ||
			passwordHasUsername(password, _username)
		) {
			return fail(400, { form });
		}

		const response = await updatePassword({ id: form.data.id, password: form.data.password });

		if (!response.ok) {
			return message(form, { status: 400 });
		}
		logout(event.cookies);
	}
};
