import { fetchSchools } from '$lib/api/school';

export async function load() {
	return {
		schools: fetchSchools()
	};
}
