export function load({ cookies }) {
	const opts = { path: '/' };
	cookies.delete('user_id', opts);
	cookies.delete('username', opts);
	cookies.delete('access', opts);
	cookies.delete('refresh', opts);
}
