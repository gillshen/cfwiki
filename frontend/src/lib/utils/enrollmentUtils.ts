import { type BaseEnrollment, progressionOrder } from '$lib/api/enrollment';

export function orderByProgressionDesc(a: BaseEnrollment, b: BaseEnrollment) {
	if (a.end_progression === b.end_progression) {
		return (
			(progressionOrder[b.start_progression] ?? 99) - (progressionOrder[a.start_progression] ?? 99)
		);
	} else {
		return (
			(progressionOrder[b.end_progression] ?? 99) - (progressionOrder[a.end_progression] ?? 99)
		);
	}
}

export function orderByDateDesc(a: BaseEnrollment, b: BaseEnrollment) {
	if (a.end_date !== b.end_date) {
		return (b.end_date ?? '').localeCompare(a.end_date ?? '');
	} else {
		return (b.start_date ?? '').localeCompare(a.start_date ?? '');
	}
}
