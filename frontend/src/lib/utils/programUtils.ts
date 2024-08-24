import type { ProgramListItem, ProgramType } from '$lib/api/program';
import { orderByName as _orderByName } from '$lib/api/school';

export function enhanceDisplayName(program: ProgramListItem): string {
	if (program.schools.length <= 1) {
		return program.display_name;
	}
	const schoolNames = formatSchoolNamesShort(program);
	return `${program.display_name} (${schoolNames})`;
}

export function formatSchoolNames(program: ProgramListItem): string {
	return _orderByName(program.schools)
		.map((s) => s.name)
		.join(' + ');
}

export function formatSchoolNamesShort(program: ProgramListItem): string {
	return _orderByName(program.schools)
		.map((s) => s.alt_name || s.name)
		.join(' + ');
}

export function isUndergraduate(program: { type: string }): boolean {
	return program.type === 'UG Freshman' || program.type === 'UG Transfer';
}

export function filterForType(programs: ProgramListItem[], type: ProgramType): ProgramListItem[] {
	return programs.filter((p) => p.type === type);
}

export function orderByName(a: ProgramListItem, b: ProgramListItem): number {
	return enhanceDisplayName(a).localeCompare(enhanceDisplayName(b));
}
