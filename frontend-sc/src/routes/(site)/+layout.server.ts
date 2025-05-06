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
	const cfUsers = await fetchCfUsers();

	// TODO remove after backend update
	cfUsers.forEach((cfer) => {
		if (!cfer.avatar) {
			cfer.avatar = randomAvatar();
		}
	});

	return {
		userId,
		username,
		user,
		cfUsers,
		students: fetchStudentsByUser({ cfer: user.username })
	};
}
