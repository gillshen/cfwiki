import type {
	ICellRendererParams,
	ValueFormatterParams,
	ValueGetterParams
} from 'ag-grid-community';

import type { School } from '$lib/api/school';
import type { StudentEnrollmentItem } from '$lib/api/student';
import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
import { lexicalChineseLast, padChineseRuns, toTitleCase } from '$lib/util/stringUtils';
import { formatCfNames } from '$lib/util/dataGridUtils';
import { formatEnrollments } from '$lib/util/enrollmentUtils';
import { makeDate, toShortDate } from '$lib/util/dateUtils';

import {
	formatNotableStatuses,
	getLatestLog,
	getNotableStatuses
} from '$lib/util/applicationUtils';

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
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'G9' })
		},
		{
			headerName: 'G10 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'G10' })
		},
		{
			headerName: 'G11 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'G11' })
		},
		{
			headerName: 'G12 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'G12' })
		}
	];

	const universityGradeColumns = [
		{
			headerName: 'Year 1 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'Year 1' })
		},
		{
			headerName: 'Year 2 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'Year 2' })
		},
		{
			headerName: 'Year 3 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'Year 3' })
		},
		{
			headerName: 'Year 4 GPA',
			valueGetter: gradeValueGetter({ enrollmentsGetter, progression: 'Year 4' })
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
			type: 'numeric',
			filter: 'agNumberColumnFilter',
			flex: 0.8
		},
		{ headerName: 'Term', field: 'term' },

		// services
		{
			headerName: '战略顾问',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '战略顾问')
		},
		{
			headerName: '顾问',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '顾问')
		},
		{
			headerName: '服务顾问',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '服务顾问')
		},
		{
			headerName: '文案',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '文案')
		},
		{
			headerName: '流程顾问',
			valueGetter: (params: ValueGetterParams) => formatCfNames(params.data.services, '流程顾问')
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

		// educational history
		{
			headerName: 'Edu. History',
			valueGetter: (params: ValueGetterParams): string =>
				formatEnrollments(params.data.student.enrollments),
			flex: 2
		},

		// grades
		...gradeColumns,

		// targets
		{
			headerName: 'School',
			field: 'schools',
			valueFormatter: (params: ValueFormatterParams) =>
				params.value.map((s: School) => s.name).join(SEPARATOR),
			flex: 3
		},
		{ headerName: 'Program', field: 'program.display_name', flex: 3 },
		{
			headerName: 'Majors/Tracks',
			field: 'majors',
			valueFormatter: (params: ValueFormatterParams) => params.value.join(SEPARATOR),
			flex: 2
		},
		{ headerName: 'Adm. Plan', field: 'round_name' },
		{
			headerName: 'Due Date',
			field: 'due_date',
			valueFormatter: (params: ValueFormatterParams) => toShortDate(params.value),
			filter: 'agDateColumnFilter',
			flex: 1.5
		},
		{
			headerName: 'Status',
			valueGetter: (params: ValueGetterParams) =>
				formatNotableStatuses(getNotableStatuses(params.data)),
			cellRenderer: ApplicationStatusRenderer,
			flex: 1.5
		},
		{
			headerName: 'Status Date',
			valueGetter: (params: ValueGetterParams) => makeDate(getLatestLog(params.data)?.date),
			valueFormatter: (params: ValueFormatterParams) => toShortDate(params.value),
			filter: 'agDateColumnFilter'
		},

		// cf academy/club involvement
		{
			headerName: 'CF Academy',
			valueGetter: (params: ValueGetterParams) =>
				getCfAcademyPrograms({ student: params.data.student, category: '' }),
			valueFormatter: (params: ValueFormatterParams) => padChineseRuns(params.value),
			useValueFormatterForExport: false,
			flex: 1.2
		},
		{
			headerName: 'CF Clubs',
			valueGetter: (params: ValueGetterParams) =>
				getCfAcademyPrograms({ student: params.data.student, category: 'club' }),
			valueFormatter: (params: ValueFormatterParams) => padChineseRuns(params.value),
			useValueFormatterForExport: false,
			flex: 1.2
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
			props: { application: params.data }
		});
	}
}

const enrollmentsGetter = (params: ValueGetterParams): StudentEnrollmentItem[] =>
	params.data.student.enrollments;
