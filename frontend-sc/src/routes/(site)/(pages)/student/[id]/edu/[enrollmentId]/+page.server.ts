import { base10Or400 } from '$lib/util/siteUtils';
import { fetchEnrollment } from '$lib/api/enrollment';

export async function load(event) {
	const id = base10Or400(event.params.enrollmentId, 'Invalid contract ID');

	return {
		enrollment: await fetchEnrollment(id)
	};
}
