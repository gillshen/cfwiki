import { fetchSchoolsWithStats } from '$lib/api/school';

export async function load(_) {
	return {
		schoolType: 'Universities',
		schools: fetchSchoolsWithStats({ type: 'university' })
	};
}
