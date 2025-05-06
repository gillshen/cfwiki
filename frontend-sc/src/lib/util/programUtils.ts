import {
	type ComposedProgramListItem,
	type ProgramCategory,
	type ProgramListItem,
	type ProgramStats,
	type ProgramType
} from '$lib/api/program';

import { orderByName as orderSchoolByName } from '$lib/util/schoolUtils';
import { blankStats } from '$lib/api/stats';
import { lexicalChineseLast } from '$lib/util/stringUtils';

export const categorizePrograms = (program: ProgramListItem): ProgramCategory => {
	if (program.type === 'UG Freshman' || program.type === 'UG Transfer') {
		return 'Undergraduate';
	} else {
		return program.type;
	}
};

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
	return program.schools
		.sort(orderSchoolByName)
		.map((s) => s.name)
		.join(' + ');
}

export function formatSchoolNamesShort(program: ProgramListItem): string {
	return program.schools
		.sort(orderSchoolByName)
		.map((s) => s.alt_name || s.name)
		.join(' + ');
}

export function filterForType(programs: ProgramListItem[], type: ProgramType): ProgramListItem[] {
	return programs.filter((p) => p.type === type);
}

export function orderByName(a: ProgramListItem, b: ProgramListItem): number {
	return lexicalChineseLast(enhanceDisplayName(a), enhanceDisplayName(b));
}
