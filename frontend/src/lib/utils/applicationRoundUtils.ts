import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
import { toLongDate } from '$lib/utils/dateUtils';
import { termOrder } from '$lib/constants/progressions';

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

export const orderByDueDate = (a: ApplicationRoundListItem, b: ApplicationRoundListItem) => {
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
		.sort(orderByDueDate);
}

export function formatRound(applRound: ApplicationRoundListItem): string {
	if (applRound.due_date) {
		return `${applRound.name}, ${toLongDate(applRound.due_date)}`;
	} else {
		return applRound.name;
	}
}

const _joiner = '\uffff';

export function groupByYearTerm(
	applRounds: ApplicationRoundListItem[]
): Record<string, ApplicationRoundListItem[]> {
	const grouped: Record<string, ApplicationRoundListItem[]> = {};

	for (const applRound of applRounds) {
		const { year, term } = applRound.program_iteration;
		const key = `${term}${_joiner}${year}`;
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(applRound);
	}

	const sortedGroups: Record<string, ApplicationRoundListItem[]> = {};
	const sortedKeys = Object.keys(grouped).sort(_orderByGroupKey);

	for (const key of sortedKeys) {
		const group = grouped[key];
		group.sort((a, b) => orderByRoundName(a.name, b.name));
		sortedGroups[key.replace(_joiner, ' ')] = group;
	}

	return sortedGroups;
}

function _orderByGroupKey(a: string, b: string): number {
	const [termA, yearA] = a.split(_joiner);
	const [termB, yearB] = b.split(_joiner);

	if (yearA === yearB) {
		return (termOrder[termA] ?? 99) - (termOrder[termB] ?? 99);
	} else {
		return parseInt(yearB, 10) - parseInt(yearA, 10);
	}
}
