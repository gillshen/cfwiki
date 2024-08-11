import { createOrUpdate } from '$lib/api/api';
import { parseNum } from '$lib/utils/numUtils';

export type Grade = {
	id: number;
	enrollment: number;
	progression: string;
	term: string;
	value: number;
	scale: number;
	is_cumulative: boolean;
	comments: string;
};

export type GroupedGrades = Record<string, Grade[]>;

const _joiner = '\u9999';

const _progressionOrder: Record<string, number> = {
	G7: 0,
	G8: 1,
	G9: 2,
	G10: 3,
	G11: 4,
	G12: 5,
	'Year 1': 6,
	'Year 2': 7,
	'Year 3': 8,
	'Year 4': 9,
	'Year 5': 10
} as const;

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
	const sortedGroupKeys = Object.keys(groupedGrades).sort(_sortGroupKeys);

	sortedGroupKeys.forEach((key) => {
		const group = groupedGrades[key];
		group.sort(_sortCumulativeLast);
		sortedGrades[key.replace(_joiner, ' ')] = group;
	});

	return sortedGrades;
}

function _sortGroupKeys(a: string, b: string): number {
	const [progA, termA] = a.split(_joiner);
	const [progB, termB] = b.split(_joiner);

	if (progA === progB) {
		return (_termOrder[termA] ?? 99) - (_termOrder[termB] ?? 99);
	} else {
		return (_progressionOrder[progA] ?? 99) - (_progressionOrder[progB] ?? 99);
	}
}

function _sortCumulativeLast(a: Grade, b: Grade): number {
	if (a.is_cumulative == b.is_cumulative) {
		return 0;
	} else {
		return a.is_cumulative ? 1 : -1;
	}
}

export async function createOrUpdateGrade(data: any) {
	return createOrUpdate(data, 'grades');
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
