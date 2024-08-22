import { fetchSchoolsWithStats } from '$lib/api/school';

export async function load(_) {
	return {
		schoolType: 'Other Institutions',
		schools: fetchSchoolsWithStats({ type: 'other' })
	};
}
