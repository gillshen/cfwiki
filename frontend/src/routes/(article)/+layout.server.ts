import { fetchCfUsers } from '$lib/api/user.js';

export async function load(event) {
	return { cfUsers: await fetchCfUsers() };
}
