import type {
	ICellRendererParams,
	ValueFormatterParams,
	ValueGetterParams
} from 'ag-grid-community';

import type { School } from '$lib/api/school';
import type { StudentEnrollmentItem } from '$lib/api/student';
import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
import { lexicalChineseLast, padChineseRuns, toTitleCase } from '$lib/util/stringUtils';
import { formatEnrollments } from '$lib/util/enrollmentUtils';
import { getSchoolRankingEntry } from '$lib/util/schoolUtils';
import { formatHistory } from '$lib/util/applicationUtils';
import { parseISO, toShortDate } from '$lib/util/dateUtils';

import {
	formatCfNames,
	formatResidence,
	getEnglishProficiency,
	getGreOrGmat,
	getSatOrAct
} from '$lib/util/dataGridUtils';

import {
	formatAlevelSummary,
	formatApSummary,
	formatIbSummary,
	formatLocation
} from '$lib/util/studentUtils';

import {
	SEPARATOR,
	IdRenderer,
	genderFilterParams,
	citizenshipValueFormatter,
	gradeValueGetter,
	SvelteCellRenderer,
	getCfAcademyPrograms
} from '$lib/util/dataGridUtils';

type PageParams = {
	year?: string | 'All';
	applicationType?: string | 'All';
	status?: string | 'All';
};

export const getColumnDefs = (params: PageParams) => {
	const secondarySchoolGradeColumns = [
		{
			headerName: 'G9 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'G9' }),
			hide: true
		},
		{
			headerName: 'G10 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'G10' }),
			hide: true
		},
		{
			headerName: 'G11 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'G11' }),
			hide: true
		},
		{
			headerName: 'G12 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'G12' }),
			hide: true
		}
	];

	const universityGradeColumns = [
		{
			headerName: 'Year 1 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'Year 1' }),
			hide: true
		},
		{
			headerName: 'Year 2 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'Year 2' }),
			hide: true
		},
		{
			headerName: 'Year 3 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'Year 3' }),
			hide: true
		},
		{
			headerName: 'Year 4 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'Year 4' }),
			hide: true
		}
	];

	let gradeColumns;

	if (params.applicationType === 'freshman') {
		gradeColumns = secondarySchoolGradeColumns;
	} else if (
		!!params.applicationType &&
		['graduate', 'masters', 'doctorate'].includes(params.applicationType)
	) {
		gradeColumns = universityGradeColumns;
	} else {
		gradeColumns = [...secondarySchoolGradeColumns, ...universityGradeColumns];
	}

	return [
		{
			headerName: '',
			field: 'id',
			cellRenderer: ApplicationIdRenderer,
			filter: false,
			sortable: false,
			maxWidth: 48,
			pinned: true
		},
		{
			headerName: 'Student',
			field: 'student.fullname',
			comparator: lexicalChineseLast,
			width: 120,
			pinned: true
		},
		{
			headerName: 'Year',
			field: 'year',
			filter: 'agNumberColumnFilter',
			flex: 0.8,
			hide: params.year !== 'All'
		},
		{ headerName: 'Term', field: 'term', hide: true },

		// services
		{
			headerName: '战略顾问',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '战略顾问'),
			hide: true
		},
		{
			headerName: '顾问',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '顾问'),
			hide: true
		},
		{
			headerName: '服务顾问',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '服务顾问'),
			hide: true
		},
		{
			headerName: '文案',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '文案'),
			hide: true
		},
		{
			headerName: '流程顾问',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '流程顾问'),
			hide: true
		},

		// bio
		{
			headerName: 'Gender',
			field: 'student.gender',
			valueFormatter: (params: ValueFormatterParams) => toTitleCase(params.value),
			filterParams: genderFilterParams
		},
		{
			headerName: 'Citizenship',
			field: 'student.citizenship',
			valueFormatter: citizenshipValueFormatter,
			useValueFormatterForExport: false
		},
		{
			headerName: 'Prim. Residence',
			valueGetter: (params: ValueGetterParams) => formatLocation(params.data.student),
			comparator: lexicalChineseLast,
			valueFormatter: (params: ValueFormatterParams) => formatResidence(params.data.student),
			useValueFormatterForExport: false,
			hide: true
		},

		// educational history
		{
			headerName: 'Edu. History',
			valueGetter: (params: ValueGetterParams) =>
				formatEnrollments(params.data.student.enrollments),
			flex: 2,
			hide: true
		},

		// grades
		...gradeColumns,

		// scores
		{
			headerName: 'SAT/ACT',
			valueGetter: (params: ValueGetterParams) => getSatOrAct(params.data.student.scores),
			hide: true
		},
		{
			headerName: 'SAT',
			field: 'student.scores.super_sat',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'ACT',
			field: 'student.scores.super_act',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'AP',
			valueGetter: (params: ValueGetterParams) => formatApSummary(params.data.student.ap_summary),
			hide: true
		},
		{
			headerName: 'IB',
			valueGetter: (params: ValueGetterParams) => formatIbSummary(params.data.student.ib_summary),
			hide: true
		},
		{
			headerName: 'A-level',
			valueGetter: (params: ValueGetterParams) =>
				formatAlevelSummary(params.data.student.alevel_summary),
			hide: true
		},
		{
			headerName: 'GRE/GMAT',
			valueGetter: (params: ValueGetterParams) => getGreOrGmat(params.data.student.scores),
			hide: true
		},
		{
			headerName: 'GRE',
			field: 'student.scores.best_gre',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'GMAT',
			field: 'student.scores.best_gmat',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'LSAT',
			field: 'student.scores.best_lsat',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'Eng. Proficiency',
			valueGetter: (params: ValueGetterParams) => getEnglishProficiency(params.data.student.scores),
			hide: true
		},
		{
			headerName: 'TOEFL',
			field: 'student.scores.best_toefl',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'IELTS',
			field: 'student.scores.best_ielts',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'Duolingo',
			field: 'student.scores.best_duolingo',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},

		// targets
		{
			headerName: 'School',
			field: 'schools',
			valueFormatter: (params: ValueFormatterParams) =>
				params.value.map((s: School) => s.name).join(SEPARATOR),
			flex: 3
		},
		{
			headerName: 'US News Rank',
			valueGetter: (params: ValueGetterParams) =>
				getHighestSchoolRank({
					schools: params.data.schools,
					year: params.data.year,
					rankingName: 'US News'
				}),
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'QS Rank',
			valueGetter: (params: ValueGetterParams) =>
				getHighestSchoolRank({
					schools: params.data.schools,
					year: params.data.year,
					rankingName: 'QS World'
				}),
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{ headerName: 'Program', field: 'program.display_name', flex: 3 },
		{
			headerName: 'Majors/Tracks',
			field: 'majors',
			valueFormatter: (params: ValueFormatterParams) => params.value.join(SEPARATOR),
			flex: 2,
			hide: params.applicationType !== 'freshman' && params.applicationType !== 'transfer'
		},
		{ headerName: 'Adm. Plan', field: 'round_name' },
		{
			headerName: 'Due Date',
			field: 'due_date',
			valueFormatter: (params: ValueFormatterParams) => toShortDate(params.value),
			filter: 'agDateColumnFilter',
			flex: 1.5,
			hide: true
		},
		{
			headerName: 'Status',
			valueGetter: (params: ValueGetterParams) => formatHistory(params.data.history),
			cellRenderer: ApplicationStatusRenderer,
			minWidth: 120,
			flex: 1.5
		},
		{
			headerName: 'Last Updated',
			valueGetter: (params: ValueGetterParams) => parseISO(params.data.last_updated),
			valueFormatter: (params: ValueFormatterParams) => toShortDate(params.value),
			filter: 'agDateColumnFilter',
			hide: true
		},

		// cf academy/club involvement
		{
			headerName: 'CF Academy',
			valueGetter: (params: ValueGetterParams) =>
				getCfAcademyPrograms({ student: params.data.student, category: '' }),
			valueFormatter: (params: ValueFormatterParams) => padChineseRuns(params.value),
			useValueFormatterForExport: false,
			flex: 1.2,
			hide: true
		},
		{
			headerName: 'CF Clubs',
			valueGetter: (params: ValueGetterParams) =>
				getCfAcademyPrograms({ student: params.data.student, category: 'club' }),
			valueFormatter: (params: ValueFormatterParams) => padChineseRuns(params.value),
			useValueFormatterForExport: false,
			flex: 1.2,
			hide: true
		}
	];
};

class ApplicationIdRenderer extends IdRenderer {
	path: string = '/application';
}

class ApplicationStatusRenderer extends SvelteCellRenderer {
	createComponent(params: ICellRendererParams): void {
		this.component = new ApplicationStatusSign({
			target: this.eGui,
			props: { application: params.data, class: 'h-[39px]' }
		});
	}
}

const enrollmentsGetter = (params: ValueGetterParams): StudentEnrollmentItem[] =>
	params.data.student.enrollments;

const getHighestSchoolRank = (params: {
	schools: School[];
	year: number;
	rankingName: string;
}): number | null => {
	const { schools, year, rankingName } = params;
	const ranks = schools
		.map((school) => getSchoolRankingEntry({ school, year, rankingName })?.rank)
		.filter(Boolean);
	const highestRank = Math.min(...(ranks as number[]));
	return highestRank === Infinity ? null : highestRank;
};
