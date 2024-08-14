import { fetchSchools, type School } from '$lib/api/school';

export async function load(_) {
	const schools: Promise<School[]> = fetchSchools();
	return { schools };
}
