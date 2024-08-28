import type { ColorVariant } from 'flowbite-svelte';

import type { ProgramListItem, ProgramType } from '$lib/api/program';
import { orderByName as _orderByName } from '$lib/api/school';

export function enhanceDisplayName(program: ProgramListItem): string {
	const defunctNote = program.is_defunct ? ' (defunct)' : '';
	if (program.schools.length <= 1) {
		return `${program.display_name}${defunctNote}`;
	}
	const schoolNames = formatSchoolNamesShort(program);
	return `${program.display_name} (${schoolNames})${defunctNote}`;
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

export function typeToBadgeColor(programType: string): ColorVariant {
	switch (programType) {
		case 'UG Freshman':
			return 'indigo';
		case 'UG Transfer':
			return 'purple';
		case "Master's":
		case 'Doctorate':
		case 'Graduate':
			return 'yellow';
		case 'Non-degree':
			return 'green';
		default:
			return 'dark';
	}
}

export function typeToBadgeText(programType: string): string {
	switch (programType) {
		case 'UG Freshman':
			return 'UG';
		case 'UG Transfer':
			return 'TR';
		case "Master's":
			return 'MA';
		case 'Doctorate':
			return 'DR';
		case 'Non-degree':
			return 'ND';
		default:
			return '??';
	}
}
