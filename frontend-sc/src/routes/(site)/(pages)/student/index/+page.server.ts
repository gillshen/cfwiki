import { fetchStudents, type StudentListItem } from '$lib/api/student';
import { groupByContractType, groupByTargetYear } from '$lib/util/studentUtils';

export async function load() {
	const groupCohort = ([year, cohort]: [year: string, cohort: StudentListItem[]]) => {
		return {
			year,
			cohortGrouped: groupByContractType(cohort, parseInt(year))
		};
	};

	return {
		groupedCohorts: fetchStudents()
			.then(groupByTargetYear)
			.then(Object.entries)
			.then((entries) => entries.sort().reverse().map(groupCohort))
	};
}
