import type { Cookies } from '@sveltejs/kit';
import type { StudentDetail, Contract } from '$lib/api/student';

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

export function canEditStudent(username: string, student: StudentDetail): boolean {
	// Returns true if the user has ever served the student or if no one has
	if (!username) {
		return false;
	}

	if (!student.contracts.length) {
		return true;
	}

	for (const contract of student.contracts) {
		if (canEditContract(username, contract)) {
			return true;
		}
	}
	return false;
}

export function canEditContract(username: string, contract: Contract): boolean {
	// Return true if the user has ever served for the contract or if no one has
	if (!username) {
		return false;
	}

	if (!contract.services.length) {
		return true;
	}

	for (const service of contract.services) {
		if (service.cf_username === username) {
			return true;
		}
	}
	return false;
}
