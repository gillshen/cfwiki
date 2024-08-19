import type { ProgramDetail, ProgramListItem } from '$lib/api/program';
import { orderByName } from '$lib/api/school';

export function formatSelectOption(program: ProgramListItem): string {
	if (program.schools.length <= 1) {
		return program.display_name;
	}
	const schoolNames = formatSchoolNamesShort(program);
	return `${program.display_name} (${schoolNames})`;
}

export function formatSchoolNamesShort(program: ProgramListItem | ProgramDetail): string {
	return orderByName(program.schools)
		.map((s) => s.alt_name || s.name)
		.join(' + ');
}

export function isUndergraduate(program: { type: string }): boolean {
	return program.type === 'UG Freshman' || program.type === 'UG Transfer';
}
