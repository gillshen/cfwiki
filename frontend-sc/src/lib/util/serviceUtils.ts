import { isFuture } from 'date-fns';

import type { Service } from '$lib/api/contract';
import { cfRoles } from '$lib/api/service';

export function isActive(service: Service): boolean {
	return !service.end_date || isFuture(service.end_date);
}

export function filterForActive(services: Service[]): Service[] {
	return services.filter((s) => isActive(s));
}

export function orderByEndDateRole(a: Service, b: Service) {
	if (a.end_date !== b.end_date) {
		if (a.end_date === null) {
			return -1;
		}
		if (b.end_date === null) {
			return 1;
		}
		return a.end_date.localeCompare(b.end_date);
	}

	const roles = Array.from(cfRoles) as string[];
	let indexA = roles.indexOf(a.role) ?? 99;
	let indexB = roles.indexOf(b.role) ?? 99;

	if (indexA === indexB) {
		return a.role.localeCompare(b.role);
	} else {
		return indexA - indexB;
	}
}

export function formatCfNames(
	services: { role: string; cf_username: string }[],
	role: string
): string {
	return services
		.filter((service) => service.role === role)
		.map((service) => service.cf_username)
		.sort()
		.join(', ');
}
