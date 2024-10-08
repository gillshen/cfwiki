import type { GridApi, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import type { BaseGrade } from '$lib/api/grade';
import type { StudentEnrollmentItem } from '$lib/api/student';
import type { AcademyProgramListItem } from '$lib/api/academyProgram';
import { parseNum } from '$lib/utils/numUtils';
import { addChinesePadding } from '$lib/utils/stringUtils';
import { orderByCategoryName } from '$lib/utils/academyProgramUtils';
import { formatGradeValue } from '$lib/utils/gradesUtils';

export const localeComparator = (
	a: string,
	b: string,
	nodeA: any,
	nodeB: any,
	isDescending: boolean
) => {
	return a.localeCompare(b, 'zh-CN');
};

export function noZeroValueFormatter(params: ValueFormatterParams): string {
	return params.value === 0 ? '' : params.value;
}

export function percentageValueFormatter(params: ValueFormatterParams): string {
	if (typeof params.value !== 'number') {
		return '';
	} else {
		return `${(params.value * 100).toFixed(1)}\u202f%`;
	}
}

export function mixedLanguageFormatter(params: ValueFormatterParams): string {
	return addChinesePadding(params.value);
}

export function getSatOrAct(data: { super_sat?: number; super_act?: number }): string {
	const { super_sat, super_act } = data;
	const satString = super_sat !== undefined ? `SAT ${super_sat}` : '';
	const actString = super_act !== undefined ? `ACT ${super_act}` : '';
	return [satString, actString].filter(Boolean).join(', ');
}

export function getGreOrGmat(data: { best_gre?: number; best_gmat?: number }): string {
	const { best_gre, best_gmat } = data;
	const greString = best_gre !== undefined ? `GRE ${best_gre}` : '';
	const gmatString = best_gmat !== undefined ? `GMAT ${best_gmat}` : '';
	return [greString, gmatString].filter(Boolean).join('/');
}

export function getEnglishProficiency(data: {
	best_toefl?: number;
	best_ielts?: number;
	best_duolingo?: number;
}): string {
	const { best_toefl, best_ielts, best_duolingo } = data;
	const toeflString = best_toefl !== undefined ? `TOEFL ${best_toefl}` : '';
	const ieltsString = best_ielts !== undefined ? `IELTS ${best_ielts.toFixed(1)}` : '';
	const duolingoString = best_duolingo !== undefined ? `Duolingo ${best_duolingo}` : '';
	return [toeflString, ieltsString, duolingoString].filter(Boolean).join('/');
}

export function getAcademyPrograms(
	student: { cf_academy_programs: AcademyProgramListItem[] },
	category: '' | 'club'
): string {
	return student.cf_academy_programs
		.filter((p) => p.category === category)
		.sort(orderByCategoryName)
		.map((p) => p.name)
		.join('; ');
}

export function gradeValueGetter(
	enrollmentsGetter: (params: ValueGetterParams) => StudentEnrollmentItem[],
	progression: string
): (params: ValueGetterParams) => string {
	return (params: ValueGetterParams) => {
		const enrollments = enrollmentsGetter(params);

		for (const e of enrollments) {
			// find grades of the right progression
			const matchingGrades = e.grades.filter((g: BaseGrade) => g.progression === progression);
			// if not found, continue with the next education experience
			if (!matchingGrades.length) {
				continue;
			}
			// if found, take the last grade and format it
			const grade: BaseGrade = matchingGrades[matchingGrades.length - 1];
			if (parseNum(grade.scale)) {
				return `${formatGradeValue(grade.value, grade.scale)}/${formatGradeValue(grade.scale)}`;
			} else {
				return grade.comments;
			}
		}
		return '';
	};
}

export function showColumn(gridApi: GridApi, headerName: string, show: boolean) {
	const columns = gridApi.getColumns();
	const targetColumns = columns!.filter((col) => col.getColDef().headerName === headerName);
	gridApi.setColumnsVisible(targetColumns, show);
}

export function moveColumnVisibilityKey(
	obj: Record<string, any>,
	key: string,
	to: number
): Record<string, any> {
	const entries = Object.entries(obj);
	const currentIndex = entries.findIndex(([k]) => k === key);

	if (currentIndex < 0) {
		throw new Error(`Key not found: ${key}`);
	}
	if (to < 0 || to >= entries.length || to === currentIndex) {
		return obj;
	}

	const [movedEntry] = entries.splice(currentIndex, 1);
	entries.splice(to, 0, movedEntry);

	return Object.fromEntries(entries);
}
