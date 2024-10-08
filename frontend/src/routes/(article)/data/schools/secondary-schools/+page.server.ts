import { fetchSchools, fetchApplicationStats } from '$lib/api/school';

export async function load(_) {
	return {
		schoolType: 'Secondary Schools',
		schools: fetchSchools({ type: 'secondary-school' }),
		stats: fetchApplicationStats()
	};
}
