import type { Service } from '$lib/api/contract';
import { leftEarly } from '$lib/util/serviceUtils';

export const canEdit = (params: {
	user: { username: string; is_staff: boolean; is_active: boolean };
	contract: { services: Service[] };
}): boolean => {
	const { user, contract } = params;

	// return true if no CFer has been assigned to it or if user stayed to the end
	return (
		!contract.services.length ||
		contract.services.some((s) => s.cf_username === user.username && !leftEarly(s))
	);
};
