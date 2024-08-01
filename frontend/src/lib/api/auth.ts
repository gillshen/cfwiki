import { post } from '$lib/api/api';

export async function authenticate(data: { username: string; password: string }) {
	return await post('token/', data);
}
