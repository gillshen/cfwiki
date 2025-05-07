import type { BaseGrade } from '$lib/api/grade';

export function summarizeByProgression(grades: BaseGrade[]): BaseGrade[] {
	const lastGradesPerProgression: Record<string, BaseGrade> = {};

	for (const grade of grades) {
		lastGradesPerProgression[grade.progression] = grade;
	}
	return Object.values(lastGradesPerProgression);
}

export const formatGrade = (grade: BaseGrade, precision: number = 3) => {
	return formatNumericGrade({ ...grade, precision }) || grade.comments;
};

export const formatNumericGrade = ({
	value,
	scale,
	precision: defaultPrecision = 3
}: {
	value: string | number;
	scale: string | number;
	precision?: number;
}): string => {
	const numericScale = parseNumber(scale);
	if (!numericScale) {
		return '';
	}
	const numericValue = parseNumber(value);

	let precision = defaultPrecision;

	// guess the most reasonable precision from
	if (Number.isInteger(numericValue) && Number.isInteger(numericScale) && numericScale > 5) {
		// likely the IB system or the 100-point system
		precision = 0;
	}

	return [numericValue, numericScale].map((n) => n.toFixed(precision)).join('\u200a/\u200a');
};

export function parseNumber(input: string | number): number {
	if (typeof input === 'number') {
		return input;
	}
	// input is a string
	return input.includes('.') ? parseFloat(input) : parseInt(input, 10);
}
