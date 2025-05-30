import { goto } from '$app/navigation';
import type { Page } from '@sveltejs/kit';
import type { SvelteComponent } from 'svelte';
import type { Readable } from 'svelte/store';
import type { Selected } from 'bits-ui';

import {
	themeQuartz,
	type ValueGetterParams,
	type ValueGetterFunc,
	type ICellRendererComp,
	type ICellRendererParams,
	type ITextFilterParams,
	type IFilterOptionDef,
	type ValueFormatterParams
} from 'ag-grid-community';

import GridLinkIcon from '$lib/components/misc/GridLinkIcon.svelte';
import type { CfUserListItem } from '$lib/api/user';
import type { StudentEnrollmentItem, StudentListItem } from '$lib/api/student';
import type { AcademyProgramListItem } from '$lib/api/academyProgram';
import { filterSortCfUsers } from '$lib/util/userUtils';
import { filterCfAcamdeyPrograms, formatCfAcamdeyPrograms } from '$lib/util/cfAcademyUtils';
import { formatLocation } from '$lib/util/studentUtils';
import { formatGradeOfProgression } from '$lib/util/enrollmentUtils';
import countryFlags from '$lib/constants/countries';

export const DEFAULT_GRID_OPTIONS = {
	enableCellTextSelection: true,
	theme: themeQuartz.withParams({
		borderColor: 'rgb(244, 244, 245)' // bg-muted
	})
};

export const DEFAULT_COL_DEF = {
	filter: true,
	flex: 1,
	minWidth: 120
};

export const SEPARATOR = ' \u2022 '; // a bullet surrounded by a space on each side

export class SearchParamsManager {
	constructor(
		private pageStore: Readable<Page>,
		private updateGrid: () => Promise<void>
	) {
		this.pageStore = pageStore;
		this.updateGrid = updateGrid;
	}

	onParamChange(searchParam: string, value?: string) {
		return async () => await this._setSearchParam(searchParam, value);
	}

	onScSelectChange(searchParam: string) {
		return async (selected: Selected<string> | undefined) => {
			if (selected) {
				await this._setSearchParam(searchParam, selected.value);
			}
		};
	}

	private async _setSearchParam(searchParam: string, value?: string) {
		const url = new URL(this.currentUrl);
		if (value === 'All' || value === undefined) {
			url.searchParams.delete(searchParam);
		} else {
			url.searchParams.set(searchParam, value);
		}
		await goto(url);
		await this.updateGrid();
	}

	private get currentUrl() {
		let url: URL;
		this.pageStore.subscribe(($page) => {
			url = $page.url;
		})();
		return url!;
	}
}

export class SvelteCellRenderer implements ICellRendererComp {
	/*
	Usage

	class <renderer_class_name> extends AgCellRenderer {
		createComponent(params: ICellRendererParams): void {
			this.component = new ExampleComponent({
				target: this.eGui,
				props: { ... } // has access to `params.data`
			})
		}
	}
	*/
	declare eGui: HTMLElement;
	declare component: SvelteComponent;

	init(params: ICellRendererParams) {
		this.eGui = document.createElement('div');
		this.eGui.classList.add('truncate');
		this.createComponent(params);
	}

	createComponent(params: ICellRendererParams): void {
		// Override this
		console.log(params);
	}

	refresh(): boolean {
		return false;
	}
	getGui() {
		return this.eGui;
	}
	destroy() {
		if (this.component) {
			this.component.$destroy();
		}
	}
}

export class IdRenderer extends SvelteCellRenderer {
	path: string = '';

	createComponent(params: ICellRendererParams): void {
		this.component = new GridLinkIcon({
			target: this.eGui,
			props: {
				href: `${this.path}/${params.data.id}`,
				target: '_self'
			}
		});
	}
}

export const genderFilterParams: ITextFilterParams = {
	filterOptions: [
		'contains',
		'notContains',
		{
			displayKey: 'Female',
			displayName: 'Is female',
			predicate: (_, cellValue) => cellValue === 'female',
			numberOfInputs: 0
		},
		{
			displayKey: 'Male',
			displayName: 'Is male',
			predicate: (_, cellValue) => cellValue === 'male',
			numberOfInputs: 0
		},
		{
			displayKey: 'Other',
			displayName: 'Is other',
			predicate: (_, cellValue) => cellValue === 'other',
			numberOfInputs: 0
		}
	] as IFilterOptionDef[]
};

export const citizenshipValueFormatter = (params: ValueFormatterParams): string =>
	`${countryFlags[params.value]}\xa0\xa0${params.value}`;

export const formatResidence = (student: StudentListItem): string => {
	const residence = formatLocation(student);
	if (!residence) {
		return '';
	}
	const flag = countryFlags[student.base_country];
	return `${flag}\xa0\xa0${residence}`;
};

export const gradeValueGetter = (params: {
	progression: string;
	enrollmentsGetter: (params: ValueGetterParams) => StudentEnrollmentItem[];
}): ValueGetterFunc => {
	const { progression, enrollmentsGetter } = params;

	// This function returns a formatted string of grades for a given progression
	// across all schools the student is enrolled in
	return (valueGetterParams: ValueGetterParams): string => {
		// student may be enrolled in more than one school during a progression
		// but each (school, progression) combination is unique
		const gradesBySchool = enrollmentsGetter(valueGetterParams)
			.map((enrollment) => ({
				schoolName: enrollment.school_name,
				grade: formatGradeOfProgression({ enrollment, progression })
			}))
			.filter((item) => item.grade !== undefined) as { schoolName: string; grade: string }[];

		if (!gradesBySchool.length) return '';

		if (gradesBySchool.length === 1) {
			// if only one school, return the grade directly
			return gradesBySchool[0].grade;
		}
		// if multiple schools, return a formatted string of grades
		// e.g. "School A: 3.5/4; School B: 3.8/4"
		return gradesBySchool.map((obj) => `${obj.schoolName}: ${obj.grade}`).join('; ');
	};
};

export const formatCfNames = (
	services: { role: string; cf_username: string }[],
	role: string
): string =>
	services
		.filter((service) => service.role === role)
		.map((service) => service.cf_username)
		.sort()
		.join(SEPARATOR);

export const getSatOrAct = (scores: { super_sat?: number; super_act?: number }): string => {
	const { super_sat, super_act } = scores;
	const satString = super_sat !== undefined ? `SAT ${super_sat}` : '';
	const actString = super_act !== undefined ? `ACT ${super_act}` : '';
	return [satString, actString].filter(Boolean).join(SEPARATOR);
};

export const getGreOrGmat = (scores: { best_gre?: number; best_gmat?: number }): string => {
	const { best_gre, best_gmat } = scores;
	const greString = best_gre !== undefined ? `GRE ${best_gre}` : '';
	const gmatString = best_gmat !== undefined ? `GMAT ${best_gmat}` : '';
	return [greString, gmatString].filter(Boolean).join(SEPARATOR);
};

export function getEnglishProficiency(scores: {
	best_toefl?: number;
	best_ielts?: number;
	best_duolingo?: number;
}): string {
	const { best_toefl, best_ielts, best_duolingo } = scores;
	const toeflString = best_toefl !== undefined ? `TOEFL ${best_toefl}` : '';
	const ieltsString = best_ielts !== undefined ? `IELTS ${best_ielts.toFixed(1)}` : '';
	const duolingoString = best_duolingo !== undefined ? `Duolingo ${best_duolingo}` : '';
	return [toeflString, ieltsString, duolingoString].filter(Boolean).join(SEPARATOR);
}

export const getCfAcademyPrograms = (params: {
	student: { cf_academy_programs: AcademyProgramListItem[] };
	category?: 'club' | string;
}): string =>
	formatCfAcamdeyPrograms({
		programs: filterCfAcamdeyPrograms({
			programs: params.student.cf_academy_programs,
			category: params.category
		}),
		separator: SEPARATOR
	});

export const getActiveUsernames = (cfUsers: CfUserListItem[]): string[] =>
	filterSortCfUsers({ users: cfUsers }).map((cfer) => cfer.username);
