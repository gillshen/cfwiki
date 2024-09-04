import { fetchSchools, fetchApplicationStats } from '$lib/api/school';

export async function load(_) {
	return {
		schoolType: 'Other Institutions',
		schools: fetchSchools({ type: 'other' }),
		stats: fetchApplicationStats()
	};
}
