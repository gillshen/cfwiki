import type { Grade } from '$lib/api/student';

type GroupedGrades = Record<string, Grade[]>;

const _joiner = '\u9999';

const _progressionOrder: Record<string, number> = {
	G9: 0,
	G10: 1,
	G11: 2,
	G12: 3,
	Freshman: 4,
	Sophomore: 5,
	Junior: 6,
	Senior: 7
} as const;

const _termOrder: Record<string, number> = {
	Fall: 0,
	Winter: 1,
	Spring: 2,
	Summer: 3
} as const;

export function groupGradesByProgressonTerm(grades: Grade[]): GroupedGrades {
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
