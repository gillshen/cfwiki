import type {
	IFilterOptionDef,
	ITextFilterParams,
	ValueFormatterParams,
	ValueGetterFunc,
	ValueGetterParams
} from 'ag-grid-community';

import type { StudentListItem, ContractSummary, StudentEnrollmentItem } from '$lib/api/student';
import { lexicalChineseLast, padChineseRuns, toTitleCase } from '$lib/util/stringUtils';
import { filterForActive } from '$lib/util/serviceUtils';
import { formatEnrollments } from '$lib/util/enrollmentUtils';

import {
	formatAlevelSummary,
	formatApSummary,
	formatIbSummary,
	formatLocation,
	formatNameWithPref
} from '$lib/util/studentUtils';

import {
	citizenshipValueFormatter,
	formatCfNames,
	formatResidence,
	genderFilterParams,
	getCfAcademyPrograms,
	getEnglishProficiency,
	getGreOrGmat,
	getSatOrAct,
	gradeValueGetter,
	IdRenderer
} from '$lib/util/dataGridUtils';

type PageParams = {
	targetYear?: string | 'All';
	contractType?: string | 'All';
	contractStatus?: string | 'All';
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

	if (params.contractType === 'UG Freshman') {
		gradeColumns = secondarySchoolGradeColumns;
	} else if (params.contractType === 'Graduate') {
		gradeColumns = universityGradeColumns;
	} else {
		gradeColumns = [...secondarySchoolGradeColumns, ...universityGradeColumns];
	}

	return [
		{
			headerName: '',
			field: 'id',
			cellRenderer: StudentIdRenderer,
			filter: false,
			sortable: false,
			maxWidth: 48,
			pinned: true
		},
		{
			headerName: 'Name',
			valueGetter: (params: ValueGetterParams) => formatNameWithPref(params.data),
			comparator: lexicalChineseLast,
			width: 120,
			pinned: true
		},

		// contracts and services
		{
			headerName: 'Target Year',
			valueGetter: targetYearValueGetter(params),
			filter: 'agNumberColumnFilter',
			flex: 0.8,
			hide: params.targetYear !== 'All'
		},
		{
			headerName: 'Contract Type',
			valueGetter: contractTypeValueGetter(params),
			hide: params.contractType !== 'All'
		},
		{
			headerName: 'Contract Status',
			valueGetter: contractStatusValueGetter(params),
			filterParams: contractStatusFilterParams,
			hide: params.contractStatus !== 'All'
		},
		{
			headerName: '战略顾问',
			valueGetter: serviceValueGetter('战略顾问', params),
			hide: true
		},
		{
			headerName: '顾问',
			valueGetter: serviceValueGetter('顾问', params)
		},
		{
			headerName: '服务顾问',
			valueGetter: serviceValueGetter('服务顾问', params),
			hide: true
		},
		{
			headerName: '文案',
			valueGetter: serviceValueGetter('文案', params)
		},
		{
			headerName: '流程顾问',
			valueGetter: serviceValueGetter('流程顾问', params)
		},

		// bio
		{
			headerName: 'Gender',
			field: 'gender',
			valueFormatter: (params: ValueFormatterParams) => toTitleCase(params.value),
			filterParams: genderFilterParams
		},
		{
			headerName: 'Citizenship',
			field: 'citizenship',
			valueFormatter: citizenshipValueFormatter,
			useValueFormatterForExport: false
		},
		{
			headerName: 'Date of Birth',
			field: 'date_of_birth',
			filter: 'agDateColumnFilter',
			hide: true
		},
		{
			headerName: 'Prim. Residence',
			valueGetter: (params: ValueGetterParams) => formatLocation(params.data),
			comparator: lexicalChineseLast,
			valueFormatter: (params: ValueFormatterParams) => formatResidence(params.data),
			useValueFormatterForExport: false
		},

		// educational history
		{
			headerName: 'Edu. History',
			valueGetter: (params: ValueGetterParams) => formatEnrollments(params.data.enrollments),
			flex: 2
		},

		// grades
		...gradeColumns,

		// scores
		{
			headerName: 'SAT/ACT',
			valueGetter: (params: ValueGetterParams) => getSatOrAct(params.data.scores),
			hide: params.contractType === 'Graduate'
		},
		{
			headerName: 'SAT',
			field: 'scores.super_sat',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'ACT',
			field: 'scores.super_act',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'AP',
			valueGetter: (params: ValueGetterParams) => formatApSummary(params.data.ap_summary),
			hide: true
		},
		{
			headerName: 'IB',
			valueGetter: (params: ValueGetterParams) => formatIbSummary(params.data.ib_summary),
			hide: true
		},
		{
			headerName: 'A-level',
			valueGetter: (params: ValueGetterParams) => formatAlevelSummary(params.data.alevel_summary),
			hide: true
		},
		{
			headerName: 'GRE/GMAT',
			valueGetter: (params: ValueGetterParams) => getGreOrGmat(params.data.scores),
			hide: params.contractType === 'UG Freshman' || params.contractType === 'UG Transfer'
		},
		{
			headerName: 'GRE',
			field: 'scores.best_gre',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'GMAT',
			field: 'scores.best_gmat',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'LSAT',
			field: 'scores.best_lsat',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'Eng. Proficiency',
			valueGetter: (params: ValueGetterParams) => getEnglishProficiency(params.data.scores)
		},
		{
			headerName: 'TOEFL',
			field: 'scores.best_toefl',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'IELTS',
			field: 'scores.best_ielts',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},
		{
			headerName: 'Duolingo',
			field: 'scores.best_duolingo',
			type: ['rightAligned'],
			filter: 'agNumberColumnFilter',
			hide: true
		},

		// cf academy/club involvement
		{
			headerName: 'CF Academy',
			valueGetter: (params: ValueGetterParams) =>
				getCfAcademyPrograms({ student: params.data, category: '' }),
			valueFormatter: (params: ValueFormatterParams) => padChineseRuns(params.value),
			useValueFormatterForExport: false,
			flex: 1.2,
			hide: true
		},
		{
			headerName: 'CF Clubs',
			valueGetter: (params: ValueGetterParams) =>
				getCfAcademyPrograms({ student: params.data, category: 'club' }),
			valueFormatter: (params: ValueFormatterParams) => padChineseRuns(params.value),
			useValueFormatterForExport: false,
			flex: 1.2,
			hide: true
		}
	];
};

class StudentIdRenderer extends IdRenderer {
	path: string = '/student';
}

const _getRelevantContract = (
	student: StudentListItem,
	params: PageParams
): ContractSummary | undefined => {
	const { targetYear, contractType, contractStatus } = params;
	const contracts = [...student.contracts].filter(
		(c) =>
			(targetYear === undefined ||
				targetYear === 'All' ||
				c.target_year === parseInt(targetYear)) &&
			(contractType === undefined || contractType === 'All' || c.type === contractType) &&
			(contractStatus === undefined || contractStatus === 'All' || c.status === contractStatus)
	);
	return contracts[0];
};

const targetYearValueGetter =
	(filterParams: PageParams): ValueGetterFunc =>
	(params: ValueGetterParams) =>
		_getRelevantContract(params.data, filterParams)?.target_year ?? null;

const contractTypeValueGetter =
	(filterParams: PageParams): ValueGetterFunc =>
	(params: ValueGetterParams) =>
		_getRelevantContract(params.data, filterParams)?.type ?? null;

const contractStatusValueGetter =
	(filterParams: PageParams): ValueGetterFunc =>
	(params: ValueGetterParams) =>
		_getRelevantContract(params.data, filterParams)?.status ?? null;

const contractStatusFilterParams: ITextFilterParams = {
	filterOptions: [
		'contains',
		'notContains',
		{
			displayKey: 'In effect',
			displayName: 'Is in effect',
			predicate: (_, cellValue) => cellValue === 'In effect',
			numberOfInputs: 0
		},
		{
			displayKey: 'Fulfilled',
			displayName: 'Is fulfilled',
			predicate: (_, cellValue) => cellValue === 'Fulfilled',
			numberOfInputs: 0
		},
		{
			displayKey: 'Terminated',
			displayName: 'Is terminated',
			predicate: (_, cellValue) => cellValue === 'Terminated',
			numberOfInputs: 0
		},
		'blank',
		'notBlank'
	] as IFilterOptionDef[]
};

const serviceValueGetter =
	(role: string, filterParams: PageParams): ValueGetterFunc =>
	(params: ValueGetterParams) => {
		const latestContract = _getRelevantContract(params.data, filterParams);
		if (!latestContract) {
			return '';
		}
		const services = filterForActive(latestContract.services);
		return formatCfNames(services, role);
	};

const enrollmentsGetter = (params: ValueGetterParams): StudentEnrollmentItem[] =>
	params.data.enrollments;
