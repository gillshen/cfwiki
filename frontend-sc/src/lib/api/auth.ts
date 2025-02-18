import { post } from '$lib/api/core';

export async function authenticate(data: { username: string; password: string }) {
	return await post('token/', data);
}
