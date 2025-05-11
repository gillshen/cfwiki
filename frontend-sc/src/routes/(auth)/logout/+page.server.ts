import { deleteCookies } from '$lib/api/auth';

export function load({ cookies }) {
	deleteCookies(cookies);
}
