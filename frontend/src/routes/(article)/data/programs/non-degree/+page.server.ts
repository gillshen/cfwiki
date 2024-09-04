import { fetchPrograms, fetchApplicationStats } from '$lib/api/program';

export async function load(_) {
	return {
		programType: 'Non-degree',
		programs: fetchPrograms({ type: 'other' }),
		stats: fetchApplicationStats({ application_type: 'other' })
	};
}
