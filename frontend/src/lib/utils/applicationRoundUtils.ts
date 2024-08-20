import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
import { toLongDate } from './dateUtils';

export function filterRounds(
	rounds: ApplicationRoundListItem[],
	year: any,
	term: any
): ApplicationRoundListItem[] {
	return rounds.filter(
		(r) => r.program_iteration.year === year && r.program_iteration.term === term
	);
}

export function formatRound(applRound: ApplicationRoundListItem): string {
	if (applRound.due_date) {
		return `${applRound.name}, ${toLongDate(applRound.due_date)}`;
	} else {
		return applRound.name;
	}
}
