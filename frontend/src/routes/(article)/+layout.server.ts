import { fetchCfUsers } from '$lib/api/user';

export async function load(_) {
	return { cfUsers: await fetchCfUsers() };
}
