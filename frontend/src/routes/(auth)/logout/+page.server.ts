import { logout } from '$lib/utils/userUtils';

export function load({ cookies }) {
	logout(cookies);
}
