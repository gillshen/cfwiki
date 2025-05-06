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
import type { BaseGrade } from '$lib/api/grade';
import type { AcademyProgramListItem } from '$lib/api/academyProgram';
import { formatGradeValue, parseNum } from '$lib/util/gradeUtils';
import { filterCfAcamdeyPrograms, formatCfAcamdeyPrograms } from '$lib/util/cfAcademyUtils';
import { formatLocation } from '$lib/util/studentUtils';
import countryFlags from '$lib/constants/countries';

export const DEFAULT_GRID_OPTIONS = {
	enableCellTextSelection: true,
	theme: themeQuartz
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

export const gradeValueGetter =
	(params: {
		progression: string;
		enrollmentsGetter: (params: ValueGetterParams) => StudentEnrollmentItem[];
	}): ValueGetterFunc =>
	(valueGetterParams: ValueGetterParams): string => {
		for (const e of params.enrollmentsGetter(valueGetterParams)) {
			// find grades of the right progression
			const matchingGrades = e.grades.filter(
				(g: BaseGrade) => g.progression === params.progression
			);
			// if not found, continue with the next educational experience
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
	cfUsers
		.filter((cfer) => cfer.is_active)
		.map((cfer) => cfer.username)
		.sort();
