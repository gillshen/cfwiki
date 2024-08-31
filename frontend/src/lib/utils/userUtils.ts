import type { Cookies } from '@sveltejs/kit';

export function defaultBanner(username: string): string {
	return `${username}\u2019s Mojo Dojo Casa House`;
}

export function passwordLongEnough(password: string): boolean {
	return password.length >= 8;
}

export function passwordHasLower(password: string): boolean {
	return !!password.match(/[a-z]/);
}

export function passwordHasUpper(password: string): boolean {
	return !!password.match(/[A-Z]/);
}

export function passwordHasDigitOrSpecial(password: string): boolean {
	return !!password.match(/[0-9,<.>/?;:'"[{\]}!@#$%^&*()—=+-]/);
}

export function passwordHasUsername(password: string, username: string): boolean {
	return !!password.match(new RegExp(username, 'i'));
}

export function logout(cookies: Cookies) {
	const opts = { path: '/' };
	cookies.delete('user_id', opts);
	cookies.delete('username', opts);
	cookies.delete('access', opts);
	cookies.delete('refresh', opts);
}
