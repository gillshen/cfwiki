import { isFuture } from 'date-fns';

import type { Service } from '$lib/api/contract';
import { cfRoles } from '$lib/api/service';

export function isActive(service: Service): boolean {
	return !service.end_date || isFuture(service.end_date);
}

export function leftEarly(service: Service): boolean {
	return !!service.end_date
}

export function filterForActive(services: Service[]): Service[] {
	return services.filter((s) => isActive(s));
}

export function groupByCfPerson(services: Service[]): Record<string, Service[]> {
	const grouped: Record<string, Service[]> = {}

	for (const service of services) {
		const key = service.cf_username
		if (!grouped[key]) {
			grouped[key] = []
		}
		grouped[key].push(service)
	}

	return grouped
}

export function orderByRole(a: Service, b: Service): number {
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
