import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
import { toLongDate } from '$lib/util/dateUtils';

const _roundOrder: Record<string, number> = {
	'ED\\s*1?': 1,
	REA: 2,
	'EA\\s*1?': 3,
	'ED\\s*2': 11,
	'EA\\s*2': 12,
	Priority: 21,
	RD: 31,
	Regular: 32,
	'Round\\s*1': 41,
	'Round\\s*2': 42,
	'Round\\s*3': 43,
	'Round\\s*4': 44,
	'Round\\s*5': 45,
	Rolling: 99
};

const _index = (name: string): number | undefined => {
	for (const pattern in _roundOrder) {
		if (name.match(pattern)) {
			return _roundOrder[pattern];
		}
	}
};

export function compareRoundName(nameA: string, nameB: string) {
	const indexA = _index(nameA);
	const indexB = _index(nameB);

	return indexA && indexB && indexA !== indexB ? indexA - indexB : nameA.localeCompare(nameB);
}

export const orderByRoundName = (a: ApplicationRoundListItem, b: ApplicationRoundListItem) =>
	compareRoundName(a.name, b.name);

export const orderByDueDate = (a: ApplicationRoundListItem, b: ApplicationRoundListItem) =>
	a.due_date && b.due_date ? a.due_date.localeCompare(b.due_date) : 0;

export const filterSortRounds = (
	rounds: ApplicationRoundListItem[],
	year: number,
	term: string
): ApplicationRoundListItem[] =>
	rounds
		.filter((r) => r.program_iteration.year === year && r.program_iteration.term === term)
		.sort(orderByRoundName)
		.sort(orderByDueDate);

export function formatRound(round: ApplicationRoundListItem): string {
	if (round.due_date) {
		return `${round.name} - ${toLongDate(round.due_date)}`;
	} else {
		return round.name;
	}
}
