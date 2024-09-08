import type { ComposedSchoolListItem, School, SchoolStats } from '$lib/api/school';
import { blankStats } from '$lib/api/stats';

export function compose(schools: School[], stats: SchoolStats[]): ComposedSchoolListItem[] {
	return schools.map((school) => {
		const statsItem = stats.find((s) => s.school_id === school.id);

		if (statsItem === undefined) {
			return { ...school, ug_stats: blankStats(), grad_stats: blankStats() };
		}

		const ug_stats = {
			applied: statsItem.ug_applied,
			pending: statsItem.ug_pending,
			accepted: statsItem.ug_accepted,
			denied: statsItem.ug_denied,
			neutral: statsItem.ug_neutral
		};
		const grad_stats = {
			applied: statsItem.grad_applied,
			pending: statsItem.grad_pending,
			accepted: statsItem.grad_accepted,
			denied: statsItem.grad_denied,
			neutral: statsItem.grad_neutral
		};
		return { ...school, ug_stats, grad_stats };
	});
}
