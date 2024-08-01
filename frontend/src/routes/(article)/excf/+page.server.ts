export async function load({ parent }) {
	const { cfUsers } = await parent();
	const exUsers = cfUsers.filter((user) => !user.is_active);
	return { exUsers };
}
