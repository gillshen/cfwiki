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

// Password checkers

export const has8Chars = (password: string) => password.length >= 8;

export const hasLowercase = (password: string) => !!password.match(/[a-z]/);

export const hasUppercase = (password: string) => !!password.match(/[A-Z]/);

export const hasDigitOrSpecial = (password: string) =>
	!!password.match(/[0-9,<.>/?;:'"[{\]}!@#$%^&*()—=+-]/);

export const noUsername = (password: string, username: string) =>
	!password.match(new RegExp(username, 'i'));
