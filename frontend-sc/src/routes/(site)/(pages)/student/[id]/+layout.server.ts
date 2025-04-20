import { fetchStudent } from '$lib/api/student';
import { base10Or400 } from '$lib/util/siteUtils';

export async function load(event) {
	const id = base10Or400(event.params.id, 'Invalid student ID');
	return { student: await fetchStudent(id) };
}
