import type { BaseGrade } from '$lib/api/grade';

export function summarizeByProgression(grades: BaseGrade[]): BaseGrade[] {
	const lastGradesPerProgression: Record<string, BaseGrade> = {};

	for (const grade of grades) {
		lastGradesPerProgression[grade.progression] = grade;
	}
	return Object.values(lastGradesPerProgression);
}

export const formatGrade = (grade: BaseGrade): string => {
	if (grade.comments) return grade.comments;
	return `${removeTrailingZeros(grade.value)}\u200a/\u200a${removeTrailingZeros(grade.scale)}`;
};

export const removeTrailingZeros = (value: number | null | undefined): string => {
	if (value === null || value === undefined) return '';
	const strValue = value.toString();
	return strValue.includes('.') ? strValue.replace(/\.?0+$/, '') : strValue;
};
