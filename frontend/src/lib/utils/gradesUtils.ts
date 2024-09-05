import type { BaseGrade, Grade, GroupedGrades } from '$lib/api/grade';
import { parseNum } from '$lib/utils/numUtils';

export function summarizeByProgression(grades: BaseGrade[]): BaseGrade[] {
	const lastGradesPerProgression: Record<string, BaseGrade> = {};

	for (const grade of grades) {
		lastGradesPerProgression[grade.progression] = grade;
	}
	return Object.values(lastGradesPerProgression);
}

export function groupByProgressionTerm(grades: Grade[]): GroupedGrades {
	const groupedGrades: GroupedGrades = {};

	for (const grade of grades) {
		const key = `${grade.progression} ${grade.term}`;
		if (!groupedGrades[key]) {
			groupedGrades[key] = [];
		}
		groupedGrades[key].push(grade);
	}

	return groupedGrades;
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
