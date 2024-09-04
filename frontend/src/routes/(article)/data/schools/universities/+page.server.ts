import { fetchSchools, fetchApplicationStats } from '$lib/api/school';

export async function load(_) {
	return {
		schoolType: 'Universities',
		schools: fetchSchools({ type: 'university' }),
		stats: fetchApplicationStats()
	};
}
