import { fetchPrograms, fetchApplicationStats } from '$lib/api/program';

export async function load(_) {
	return {
		programType: 'Graduate',
		programs: fetchPrograms({ type: 'graduate' }),
		stats: fetchApplicationStats({ application_type: 'graduate' })
	};
}
