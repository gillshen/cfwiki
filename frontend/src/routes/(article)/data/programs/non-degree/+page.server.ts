import { fetchProgramsWithStats } from '$lib/api/program';

export async function load(_) {
	return {
		programType: 'Non-degree',
		programs: fetchProgramsWithStats({ type: 'non-degree' })
	};
}
