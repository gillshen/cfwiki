import { redirect } from '@sveltejs/kit';

import { fetchCfUsers } from '$lib/api/user';
import { fetchUser } from '$lib/api/user';
import { fetchStudentsByUser } from '$lib/api/student';
import { randomAvatar } from '$lib/assets/avatars/index';

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

	const user = await fetchUser(username);

	return {
		userId,
		username,
		user: { ...user, avatar: randomAvatar() },
		cfUsers: await fetchCfUsers(),
		students: fetchStudentsByUser({ cfer: user.username })
	};
}
