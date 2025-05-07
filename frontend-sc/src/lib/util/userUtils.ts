import type { Cookies } from '@sveltejs/kit';
import type { CfUserListItem } from '$lib/api/user';

export const filterSortCfUsers = ({
	users,
	department,
	employmentStatus
}: {
	users: CfUserListItem[];
	department?: '文案' | '咨询' | undefined;
	employmentStatus?: 'current' | 'past' | undefined;
}): CfUserListItem[] => {
	return users
		.filter(
			(user) =>
				(!department || user.department === department) &&
				// if looking for current users, get the active ones
				(employmentStatus !== 'current' || user.is_active) &&
				// if looking for past users, get the inactive ones
				(employmentStatus !== 'past' || !user.is_active)
		)
		.sort(orderByUsername);
};

export function orderByUsername(a: CfUserListItem, b: CfUserListItem): number {
	return a.username.localeCompare(b.username);
}

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
