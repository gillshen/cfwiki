import { isFuture } from 'date-fns';

import type { Contract, Service } from '$lib/api/contract';
import { CF_ROLES } from '$lib/api/service';
import { toShortDate } from '$lib/util/dateUtils';

export function isActive(service: Service): boolean {
	return !service.end_date || isFuture(service.end_date);
}

export function endedEarly(service: Service): boolean {
	return !!service.end_date;
}

export function filterForActive(services: Service[]): Service[] {
	return services.filter((s) => isActive(s));
}

export function orderByRoleUsername(a: Service, b: Service): number {
	const roles = [...CF_ROLES] as string[];
	const indexA = roles.indexOf(a.role) ?? 99;
	const indexB = roles.indexOf(b.role) ?? 99;

	if (indexA !== indexB) {
		return indexA - indexB;
	}
	// If roles are identical, compare username
	return a.cf_username.localeCompare(b.cf_username);
}

export function formatDates({ service, contract }: { service: Service; contract: Contract }): {
	startDate: string;
	endDate: string;
} {
	return {
		startDate: toShortDate(service.start_date ?? contract.date) || 'Start of contract',
		endDate:
			toShortDate(service.end_date) || (contract.status === 'In effect' ? 'n/a' : 'End of contract')
	};
}
