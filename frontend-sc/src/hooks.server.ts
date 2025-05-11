import { error, redirect, type Handle } from '@sveltejs/kit';
import { authenticateUser } from '$lib/api/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const {
		url: { pathname, search },
		locals,
		cookies
	} = event;

	// fix an annoying SvelteKit Error
	// https://github.com/sveltejs/kit/issues/13743#issuecomment-2849193103
	if (pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 });
	}

	if (pathname.match(/^[/]log(in|out)/)) {
		return resolve(event);
	}

	locals.user = await authenticateUser(cookies);

	// check if user is authenticated
	if (!locals.user) {
		const fromUrl = pathname + search;
		throw redirect(302, `/login?redirectTo=${fromUrl}`);
	}

	// check if user is has admin privilege
	if (pathname.match(/^[/]admin/) && !locals.user.is_staff) {
		throw error(403, 'Access Denied');
	}

	return resolve(event);
};
