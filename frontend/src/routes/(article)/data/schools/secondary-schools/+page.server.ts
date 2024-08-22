import { fetchSchoolsWithStats } from '$lib/api/school';

export async function load(_) {
	return {
		schoolType: 'Secondary Schools',
		schools: fetchSchoolsWithStats({ type: 'secondary-school' })
	};
}
