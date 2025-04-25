import type {
	IFilterOptionDef,
	ITextFilterParams,
	ValueFormatterParams,
	ValueGetterFunc,
	ValueGetterParams
} from 'ag-grid-community';

import type { StudentListItem, ContractSummary, StudentEnrollmentItem } from '$lib/api/student';
import countryFlags from '$lib/constants/countries';
import { lexicalChineseLast, padChineseRuns, toTitleCase } from '$lib/util/stringUtils';
import { filterForActive } from '$lib/util/serviceUtils';
import { formatEnrollments } from '$lib/util/enrollmentUtils';

import {
	formatAlevelSummary,
	formatApSummary,
	formatIbSummary,
	formatLocation
} from '$lib/util/studentUtils';

import {
	citizenshipValueFormatter,
	formatCfNames,
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
			valueGetter: nameValueGetter,
			comparator: lexicalChineseLast,
			width: 120,
			pinned: true
		},

		// contracts and services
		{
			headerName: 'Target Year',
			valueGetter: targetYearValueGetter(params),
			type: 'numeric',
			filter: 'agNumberColumnFilter',
			flex: 0.8
		},
		{
			headerName: 'Contract Type',
			valueGetter: contractTypeValueGetter(params)
		},
		{
			headerName: 'Contract Status',
			valueGetter: contractStatusValueGetter(params),
			filterParams: contractStatusFilterParams
		},
		{
			headerName: '战略顾问',
			valueGetter: serviceValueGetter('战略顾问', params)
		},
		{
			headerName: '顾问',
			valueGetter: serviceValueGetter('顾问', params)
		},
		{
			headerName: '服务顾问',
			valueGetter: serviceValueGetter('服务顾问', params)
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
			filter: 'agDateColumnFilter'
		},
		{
			headerName: 'Primary Residence',
			valueGetter: residenceValueGetter,
			comparator: lexicalChineseLast,
			valueFormatter: residenceValueFormatter,
			useValueFormatterForExport: false
		},

		// educational history
		{
			headerName: 'Edu. History',
			valueGetter: (params: ValueGetterParams): string =>
				formatEnrollments(params.data.enrollments),
			flex: 2
		},

		// grades
		...gradeColumns,

		// scores
		{
			headerName: 'SAT/ACT',
			valueGetter: (params: ValueGetterParams) => getSatOrAct(params.data.scores)
		},
		{
			headerName: 'SAT',
			field: 'scores.super_sat',
			type: ['numeric', 'rightAligned'],
			filter: 'agNumberColumnFilter'
		},
		{
			headerName: 'ACT',
			field: 'scores.super_act',
			type: ['numeric', 'rightAligned'],
			filter: 'agNumberColumnFilter'
		},
		{
			headerName: 'AP',
			valueGetter: (params: ValueGetterParams) => formatApSummary(params.data.ap_summary)
		},
		{
			headerName: 'IB',
			valueGetter: (params: ValueGetterParams) => formatIbSummary(params.data.ib_summary)
		},
		{
			headerName: 'A-level',
			valueGetter: (params: ValueGetterParams) => formatAlevelSummary(params.data.alevel_summary)
		},
		{
			headerName: 'GRE/GMAT',
			valueGetter: (params: ValueGetterParams) => getGreOrGmat(params.data.scores)
		},
		{
			headerName: 'GRE',
			field: 'scores.best_gre',
			type: ['numeric', 'rightAligned'],
			filter: 'agNumberColumnFilter'
		},
		{
			headerName: 'GMAT',
			field: 'scores.best_gmat',
			type: ['numeric', 'rightAligned'],
			filter: 'agNumberColumnFilter'
		},
		{
			headerName: 'LSAT',
			field: 'scores.best_lsat',
			type: ['numeric', 'rightAligned'],
			filter: 'agNumberColumnFilter'
		},
		{
			headerName: 'Eng. Proficiency',
			valueGetter: (params: ValueGetterParams) => getEnglishProficiency(params.data.scores)
		},
		{
			headerName: 'TOEFL',
			field: 'scores.best_toefl',
			type: ['numeric', 'rightAligned'],
			filter: 'agNumberColumnFilter'
		},
		{
			headerName: 'IELTS',
			field: 'scores.best_ielts',
			type: ['numeric', 'rightAligned'],
			filter: 'agNumberColumnFilter'
		},
		{
			headerName: 'Duolingo',
			field: 'scores.best_duolingo',
			type: ['numeric', 'rightAligned'],
			filter: 'agNumberColumnFilter'
		},

		// cf academy/club involvement
		{
			headerName: 'CF Academy',
			valueGetter: (params: ValueGetterParams) =>
				getCfAcademyPrograms({ student: params.data, category: '' }),
			valueFormatter: (params: ValueFormatterParams) => padChineseRuns(params.value),
			useValueFormatterForExport: false,
			flex: 1.2
		},
		{
			headerName: 'CF Clubs',
			valueGetter: (params: ValueGetterParams) =>
				getCfAcademyPrograms({ student: params.data, category: 'club' }),
			valueFormatter: (params: ValueFormatterParams) => padChineseRuns(params.value),
			useValueFormatterForExport: false,
			flex: 1.2
		}
	];
};

class StudentIdRenderer extends IdRenderer {
	path: string = '/student';
}

const _formatName = (student: StudentListItem): string => {
	if (!student.preferred_name || student.preferred_name === student.given_name) {
		return student.fullname;
	} else {
		return `${student.fullname} ${student.preferred_name}`;
	}
};

const nameValueGetter = (params: ValueGetterParams): string => {
	return _formatName(params.data);
};

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

const residenceValueGetter = (params: ValueGetterParams): string => formatLocation(params.data);

const residenceValueFormatter = (params: ValueFormatterParams): string => {
	const residence = formatLocation(params.data);
	if (!residence) {
		return '';
	}
	const flag = countryFlags[params.data.base_country];
	return `${flag}\xa0\xa0${residence}`;
};

const enrollmentsGetter = (params: ValueGetterParams): StudentEnrollmentItem[] =>
	params.data.enrollments;
