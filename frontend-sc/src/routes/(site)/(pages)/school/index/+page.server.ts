import { fetchSchools } from '$lib/api/school';

export async function load() {
	return {
		schoolsGrouped: fetchSchools().then((schools) =>
			Object.groupBy(schools, (school) => school.type)
		)
	};
}
