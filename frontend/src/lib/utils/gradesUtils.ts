import type { Grade, GroupedGrades } from '$lib/api/grade';
import { progressionOrder } from '$lib/api/enrollment';
import { parseNum } from '$lib/utils/numUtils';
import { termOrder } from '$lib/constants/progressions';

const _joiner = '\u9999';

export function groupByProgressionTerm(grades: Grade[]): GroupedGrades {
	const groupedGrades: GroupedGrades = {};

	for (const grade of grades) {
		const key = `${grade.progression}${_joiner}${grade.term}`;
		if (!groupedGrades[key]) {
			groupedGrades[key] = [];
		}
		groupedGrades[key].push(grade);
	}

	const sortedGrades: GroupedGrades = {};
	const sortedGroupKeys = Object.keys(groupedGrades).sort(_orderByGroupKey);

	for (const key of sortedGroupKeys) {
		const group = groupedGrades[key];
		group.sort(_orderByCumulativeLast);
		sortedGrades[key.replace(_joiner, ' ')] = group;
	}

	return sortedGrades;
}

function _orderByGroupKey(a: string, b: string): number {
	const [progA, termA] = a.split(_joiner);
	const [progB, termB] = b.split(_joiner);

	if (progA === progB) {
		return (termOrder[termA] ?? 99) - (termOrder[termB] ?? 99);
	} else {
		return (progressionOrder[progA] ?? 99) - (progressionOrder[progB] ?? 99);
	}
}

function _orderByCumulativeLast(a: Grade, b: Grade): number {
	if (a.is_cumulative == b.is_cumulative) {
		return 0;
	} else {
		return a.is_cumulative ? 1 : -1;
	}
}

export const formatGradeValue = (
	inputValue: string | number,
	inputScale?: string | number
): string => {
	const value = parseNum(inputValue);
	const scale = inputScale === undefined ? value : parseNum(inputScale);

	if (scale > 5 && Number.isInteger(value)) {
		return value.toString();
	} else {
		return value.toFixed(3);
	}
};
