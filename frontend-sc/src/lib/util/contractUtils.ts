import type { Service } from '$lib/api/contract';
import { leftEarly } from '$lib/util/serviceUtils';

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
		contract.services.some((s) => s.cf_username === user.username && !leftEarly(s))
	);
};
