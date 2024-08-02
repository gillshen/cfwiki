import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const username = event.cookies.get('username');
	const pathname = event.url.pathname;

	if (!username && !pathname.startsWith('/login') && !pathname.startsWith('/logout')) {
		throw redirect(302, '/login');
	}

	if (username && pathname.startsWith('/login')) {
		throw redirect(302, '/home');
	}

	const response = await resolve(event);
	return response;
};
