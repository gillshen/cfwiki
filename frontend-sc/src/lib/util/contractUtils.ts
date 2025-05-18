import type { Contract, ContractStatus, Service } from '$lib/api/contract';
import { endedEarly } from '$lib/util/serviceUtils';

export const userCanEdit = (params: {
	user: { username: string; is_staff: boolean; is_active: boolean };
	contract: { services: Service[] };
}): boolean => {
	const { user, contract } = params;

	if (!user.is_active) {
		return false;
	}
	// TODO uncomment in production
	// if (user.is_admin) {
	// 	return true;
	// }

	// return true if no CFer has been assigned to it or if user stayed to the end
	return (
		!contract.services.length ||
		contract.services.some((s) => s.cf_username === user.username && !endedEarly(s))
	);
};

const statusOrdering: Record<ContractStatus, number> = {
	'In effect': 1,
	Fulfilled: 2,
	Terminated: 2
};

export const orderByStatusTargetYearDesc = (a: Contract, b: Contract): number => {
	const statusA = statusOrdering[a.status];
	const statusB = statusOrdering[b.status];

	if (statusA === statusB) {
		return (b.date ?? '').localeCompare(a.date ?? '');
	}
	return statusA - statusB;
};
