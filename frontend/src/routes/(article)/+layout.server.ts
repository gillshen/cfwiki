import { fetchCfUsers } from '$lib/api/user';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const userIdString = event.cookies.get('user_id');

	if (!userIdString) {
		throw redirect(302, '/login');
	}

	const userId = parseInt(userIdString, 10);
	const username = event.cookies.get('username');

	return {
		userId,
		username,
		cfUsers: await fetchCfUsers()
	};
}
