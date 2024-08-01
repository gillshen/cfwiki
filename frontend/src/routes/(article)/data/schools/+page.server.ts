import { fetchSchools, type School } from '$lib/api/school';

export async function load(event) {
	const schools: School[] = await fetchSchools();
	return { schools };
}
