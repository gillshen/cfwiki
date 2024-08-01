import { redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { jwtDecode } from 'jwt-decode';

import { authSchema } from '$lib/schemas/auth';
import { authenticate } from '$lib/api/auth.js';

export async function load(event) {
	const username = event.cookies.get('username');

	if (username) {
		throw redirect(302, '/home');
	}

	const authForm = await superValidate(zod(authSchema));
	return { authForm };
}

export const actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(authSchema));

		if (!form.valid) {
			form.data.password = '';
			return fail(400, { form });
		}

		const response = await authenticate(form.data);

		// Authentication failed
		if (!response.ok) {
			form.data.password = '';
			return message(form, 'Incorrect username or password', { status: 403 });
		}

		// Authentication successful
		const { access, refresh } = await response.json();
		const { user_id, username } = jwtDecode(access) as {
			user_id: string;
			username: string;
		};

		event.cookies.set('access', access, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24, // 1 day
			path: ''
		});

		event.cookies.set('refresh', refresh, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 15, // 15 days
			path: ''
		});

		event.cookies.set('user_id', user_id, { httpOnly: true, sameSite: 'strict', path: '' });
		event.cookies.set('username', username, { httpOnly: true, sameSite: 'strict', path: '' });

		throw redirect(302, '/home');
	}
};
