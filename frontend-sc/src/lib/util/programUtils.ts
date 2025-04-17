import {
	type ComposedProgramListItem,
	type ProgramListItem,
	type ProgramStats,
	type ProgramType
} from '$lib/api/program';

import { orderByName as _orderByName } from '$lib/util/schoolUtils';
import { blankStats } from '$lib/api/stats';
import { lexicalChineseLast } from '$lib/util/stringUtils';

const PROGRAM_CATEGORIES = ['Undergraduate', "Master's", 'Doctorate', 'Non-degree'] as const;

type PorgramCategory = (typeof PROGRAM_CATEGORIES)[number];

export function groupByCategory(
	programs: ProgramListItem[]
): [PorgramCategory, ProgramListItem[]][] {
	const result: [PorgramCategory, ProgramListItem[]][] = [];

	for (const category of PROGRAM_CATEGORIES) {
		const matchingPrograms = programs.filter((program) =>
			category === 'Undergraduate' ? isUndergraduate(program) : program.type === category
		);
		if (matchingPrograms.length) {
			matchingPrograms.sort(_orderByName);
			result.push([category, matchingPrograms]);
		}
	}

	return result;
}

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
		.sort(_orderByName)
		.map((s) => s.name)
		.join(' + ');
}

export function formatSchoolNamesShort(program: ProgramListItem): string {
	return program.schools
		.sort(_orderByName)
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
	return lexicalChineseLast(enhanceDisplayName(a), enhanceDisplayName(b));
}

export function orderBySchoolNames(a: ProgramListItem, b: ProgramListItem): number {
	return lexicalChineseLast(formatSchoolNames(a), formatSchoolNames(b));
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
