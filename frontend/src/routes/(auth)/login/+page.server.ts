import { redirect } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { jwtDecode } from 'jwt-decode';

import { authSchema } from '$lib/schemas/auth';
import { authenticate } from '$lib/api/auth';

export async function load(_) {
	return { authForm: await superValidate(zod(authSchema)) };
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

		const opts: { httpOnly: boolean; sameSite: 'strict'; path: string } = {
			httpOnly: true,
			sameSite: 'strict',
			path: '/'
		};

		event.cookies.set('access', access, {
			...opts,
			maxAge: 60 * 60 * 24 // 1 day
		});

		event.cookies.set('refresh', refresh, {
			...opts,
			maxAge: 60 * 60 * 24 * 15 // 15 days
		});

		event.cookies.set('user_id', user_id, opts);
		event.cookies.set('username', username, opts);

		throw redirect(302, '/home');
	}
};
