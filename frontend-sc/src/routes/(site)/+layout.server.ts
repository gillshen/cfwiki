import { fetchCfUsers } from '$lib/api/user';
import { fetchUser } from '$lib/api/user';
import { fetchStudentsByUser } from '$lib/api/student';
import { randomAvatar } from '$lib/assets/avatars/index';

export async function load({ locals }) {
	const { id: userId, username } = locals.user!;

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
