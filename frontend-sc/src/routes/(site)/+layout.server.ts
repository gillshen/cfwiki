import { redirect } from '@sveltejs/kit';

import { fetchCfUsers } from '$lib/api/user';
import { fetchUser } from '$lib/api/user';
import { fetchStudentsByUser } from '$lib/api/student';

export async function load(event) {
	const userIdString = event.cookies.get('user_id');

	if (!userIdString) {
		throw redirect(302, '/login');
	}

	const userId = parseInt(userIdString, 10);
	const username = event.cookies.get('username');
	
	if (isNaN(userId) || !username) {
		throw redirect(302, '/login');
	}
	
	const host = await fetchUser(username)
	
	return {
		userId,
		username,
		cfUsers: await fetchCfUsers(),
		students: fetchStudentsByUser({ cfer: host.id }),
	};
}
