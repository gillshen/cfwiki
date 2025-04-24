import type { AcademyProgramListItem } from '$lib/api/academyProgram';
import { lexicalChineseLast } from '$lib/util/stringUtils';

export function orderByCategoryName(
	a: { name: string; category: string },
	b: { name: string; category: string }
): number {
	if (a.category === b.category) {
		return lexicalChineseLast(a.name, b.name);
	} else {
		return a.category.localeCompare(b.category);
	}
}

export function filterCfAcamdeyPrograms(params: {
	programs: AcademyProgramListItem[];
	category?: 'club' | string;
}): AcademyProgramListItem[] {
	const { programs, category } = params;
	return programs.filter((p) => category && p.category === category);
}

export function formatCfAcamdeyPrograms(params: {
	programs: AcademyProgramListItem[];
	separator?: string;
}): string {
	return params.programs
		.sort(orderByCategoryName)
		.map((p) => p.name)
		.join(params.separator ?? '; ');
}
