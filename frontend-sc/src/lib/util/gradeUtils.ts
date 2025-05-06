import type { BaseGrade } from '$lib/api/grade';

export function summarizeByProgression(grades: BaseGrade[]): BaseGrade[] {
	const lastGradesPerProgression: Record<string, BaseGrade> = {};

	for (const grade of grades) {
		lastGradesPerProgression[grade.progression] = grade;
	}
	return Object.values(lastGradesPerProgression);
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

export function parseNum(input: string | number): number {
	if (typeof input === 'number') {
		return input;
	}
	// input is a string
	return input.includes('.') ? parseFloat(input) : parseInt(input, 10);
}
