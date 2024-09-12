import type { ColorVariant } from 'flowbite-svelte';

import type {
	ComposedProgramListItem,
	ProgramListItem,
	ProgramStats,
	ProgramType
} from '$lib/api/program';

import { orderByName as _orderByName } from '$lib/api/school';
import { blankStats } from '$lib/api/stats';

export function combineWithStats(
	programs: ProgramListItem[],
	stats: ProgramStats[]
): ComposedProgramListItem[] {
	return programs.map((program) => {
		const statsItem = stats.find((s) => s.program_id === program.id) ?? blankStats();
		return { ...program, stats: statsItem };
	});
}

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

export function orderBySchoolNames(a: ProgramListItem, b: ProgramListItem): number {
	return formatSchoolNames(a).localeCompare(formatSchoolNames(b));
}

export function typeToBadgeColor(programType: string): string {
	switch (programType) {
		case 'UG Freshman':
			return 'bg-stone-100 text-gray-700';
		case 'UG Transfer':
			return 'bg-pink-100 text-pink-700';
		case "Master's":
		case 'Graduate':
			return 'bg-stone-500 text-white';
		case 'Doctorate':
			return 'bg-gray-700 text-white';
		case 'Non-degree':
			return 'bg-green-200 text-green-700';
		default:
			return 'bg-black text-white';
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
