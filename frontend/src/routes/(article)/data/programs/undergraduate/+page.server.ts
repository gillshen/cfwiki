import { fetchProgramsWithStats } from '$lib/api/program';

export async function load(_) {
	return {
		programType: 'Undergraduate',
		programs: fetchProgramsWithStats({ type: 'undergraduate' })
	};
}
