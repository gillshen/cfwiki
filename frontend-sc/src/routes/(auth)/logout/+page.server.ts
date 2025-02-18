import { logout } from '$lib/util/userUtils';

export function load({ cookies }) {
	logout(cookies);
}
