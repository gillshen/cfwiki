import { fetchProgramsWithStats } from '$lib/api/program';

export async function load(_) {
	return {
		programType: 'Graduate',
		programs: fetchProgramsWithStats({ type: 'graduate' })
	};
}
