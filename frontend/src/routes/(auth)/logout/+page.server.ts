export function load({ cookies }) {
	cookies.delete('user_id', { path: '/login' });
	cookies.delete('username', { path: '/login' });
	cookies.delete('access', { path: '/login' });
	cookies.delete('refresh', { path: '/login' });
}
