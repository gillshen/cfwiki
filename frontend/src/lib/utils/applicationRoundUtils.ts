import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
import { toLongDate } from '$lib/utils/dateUtils';

const _roundOrder: Record<string, number> = {
	'ED\\s*1?': 0,
	REA: 1,
	'EA\\s*1?': 2,
	'ED\\s*2': 3,
	'EA\\s*2': 4,
	Priority: 5,
	RD: 6,
	Regular: 6,
	'Round\\s*1': 7,
	'Round\\s*2': 8,
	'Round\\s*3': 9,
	'Round\\s*4': 10,
	'Round\\s*5': 11,
	Rolling: 99
};

const _index = (name: string): number | undefined => {
	for (const pattern in _roundOrder) {
		if (name.match(pattern)) {
			return _roundOrder[pattern];
		}
	}
};

export function orderByRoundName(nameA: string, nameB: string) {
	const indexA = _index(nameA);
	const indexB = _index(nameB);

	if (indexA === indexB || indexA === undefined || indexB === undefined) {
		return nameA.localeCompare(nameB);
	} else {
		return indexA - indexB;
	}
}

const _orderByDueDate = (a: ApplicationRoundListItem, b: ApplicationRoundListItem) => {
	if (a.due_date && b.due_date) {
		return a.due_date.localeCompare(b.due_date);
	} else {
		return 0;
	}
};

export function filterSortRounds(
	rounds: ApplicationRoundListItem[],
	year: any,
	term: any
): ApplicationRoundListItem[] {
	return rounds
		.filter((r) => r.program_iteration.year === year && r.program_iteration.term === term)
		.sort((a, b) => orderByRoundName(a.name, b.name))
		.sort(_orderByDueDate);
}

export function formatRound(applRound: ApplicationRoundListItem): string {
	if (applRound.due_date) {
		return `${applRound.name}, ${toLongDate(applRound.due_date)}`;
	} else {
		return applRound.name;
	}
}
