import { fetchApplicationStats, fetchPrograms } from '$lib/api/program';

export async function load(_) {
	return {
		programType: 'Undergraduate',
		programs: fetchPrograms({ type: 'undergraduate' }),
		stats: fetchApplicationStats({ application_type: 'undergraduate' })
	};
}
