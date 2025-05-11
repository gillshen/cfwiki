import { redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { authSchema } from '$lib/schemas/auth';
import { getAccess, setCookies } from '$lib/api/auth';

let redirectTo: string | null;

export async function load(event) {
	redirectTo = event.url.searchParams.get('redirectTo');
	return { authForm: await superValidate(zod(authSchema)) };
}

export const actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(authSchema));

		if (!form.valid) {
			form.data.password = '';
			return fail(400, { form });
		}

		const response = await getAccess(form.data);

		// Authentication failed
		if (!response) {
			form.data.password = '';
			return message(form, 'Invalid username or password', { status: 403 });
		}

		// Authentication successful
		setCookies({ cookies: event.cookies, response });

		// redirect to where the user was trying to reach
		if (redirectTo) {
			throw redirect(302, `/${redirectTo.slice(1)}`);
		}
		throw redirect(302, '/home');
	}
};
