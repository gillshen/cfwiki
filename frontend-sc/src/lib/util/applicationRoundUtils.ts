import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
import { toLongDate } from '$lib/util/dateUtils';
import { termOrder } from '$lib/constants/progressions';

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

const _joiner = '\uffff';

export function groupByYearTerm(
	rounds: ApplicationRoundListItem[]
): Record<string, ApplicationRoundListItem[]> {
	const grouped: Record<string, ApplicationRoundListItem[]> = {};

	for (const round of rounds) {
		const { year, term } = round.program_iteration;
		const key = `${term}${_joiner}${year}`;
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(round);
	}

	const sortedGroups: Record<string, ApplicationRoundListItem[]> = {};
	const sortedKeys = Object.keys(grouped).sort(_orderByGroupKey);

	for (const key of sortedKeys) {
		const group = grouped[key];
		group.sort((a, b) => compareRoundName(a.name, b.name));
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
