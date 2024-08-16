import { progressionOrder } from '$lib/api/enrollment';
import type { Grade, GroupedGrades } from '$lib/api/grade';
import { parseNum } from './numUtils';

const _joiner = '\u9999';
const _termOrder: Record<string, number> = {
	Fall: 0,
	Winter: 1,
	Spring: 2,
	Summer: 3,
	Year: 4
} as const;

export function groupGradesByProgressionTerm(grades: Grade[]): GroupedGrades {
	const groupedGrades: GroupedGrades = {};

	grades.forEach((grade: Grade) => {
		const key = `${grade.progression}${_joiner}${grade.term}`;
		if (!groupedGrades[key]) {
			groupedGrades[key] = [];
		}
		groupedGrades[key].push(grade);
	});

	const sortedGrades: GroupedGrades = {};
	const sortedGroupKeys = Object.keys(groupedGrades).sort(_orderByGroupKeys);

	sortedGroupKeys.forEach((key) => {
		const group = groupedGrades[key];
		group.sort(_orderByCumulativeLast);
		sortedGrades[key.replace(_joiner, ' ')] = group;
	});

	return sortedGrades;
}

function _orderByGroupKeys(a: string, b: string): number {
	const [progA, termA] = a.split(_joiner);
	const [progB, termB] = b.split(_joiner);

	if (progA === progB) {
		return (_termOrder[termA] ?? 99) - (_termOrder[termB] ?? 99);
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
