<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Heading } from 'flowbite-svelte';

	import {
		createGrid,
		type ColumnMovedEvent,
		type ColumnVisibleEvent,
		type GridApi,
		type GridOptions,
		type ICellRendererParams,
		type ValueFormatterParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import type { ApplicantListItem, ApplicationListItem } from '$lib/api/application';
	import type { StudentEnrollmentItem } from '$lib/api/student';
	import type { School } from '$lib/api/school';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { SvelteCellRenderer } from '$lib/abstract/agCellRenderer';
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import IdLink from '$lib/components/grid-cells/IdLink.svelte';
	import Gender from '$lib/components/grid-cells/Gender.svelte';
	import ApplicationStatus from '$lib/components/grid-cells/ApplicationStatus.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import ControlButton from '$lib/components/grid-pages/ControlButton.svelte';
	import ControlDrawer from '$lib/components/grid-pages/ControlDrawer.svelte';
	import DownloadButton from '$lib/components/grid-pages/DownloadButton.svelte';
	import { formatAlevelSummary, formatApSummary, formatIbSummary } from '$lib/utils/studentUtils';
	import { formatCfNames } from '$lib/utils/serviceUtils';
	import { formatEnrollments } from '$lib/utils/enrollmentUtils';
	import { getLatestRanking } from '$lib/utils/schoolUtils';

	import {
		compose,
		formatApplicationType,
		formatNotableStatuses,
		getLatestLog,
		getNotableStatuses,
		orderByStatusDateDesc
	} from '$lib/utils/applicationUtils';

	import {
		getAcademyPrograms,
		getEnglishProficiency,
		getGreOrGmat,
		getSatOrAct,
		gradeValueGetter,
		localeComparator,
		mixedLanguageFormatter,
		moveColumnVisibilityKey,
		showColumn
	} from '$lib/utils/gridUtils';

	export let data: {
		applications: Promise<ApplicationListItem[]>;
		applicants: Promise<ApplicantListItem[]>;
		year?: number;
		applicationType?: string;
		pending?: boolean;
	};

	class IdRenderer extends SvelteCellRenderer {
		createComponent(params: ICellRendererParams): void {
			this.component = new IdLink({
				target: this.eGui,
				props: { entity: params.data, path: '/application' }
			});
		}
	}

	class GenderRenderer extends SvelteCellRenderer {
		createComponent(params: ICellRendererParams): void {
			this.component = new Gender({
				target: this.eGui,
				props: { student: params.data.student }
			});
		}
	}

	class StatusRenderer extends SvelteCellRenderer {
		createComponent(params: ICellRendererParams): void {
			this.component = new ApplicationStatus({
				target: this.eGui,
				props: { application: params.data }
			});
		}
	}

	function citizenshipValueFormatter(params: ValueFormatterParams): string {
		const flag = countryFlags[params.value];
		return `${flag}\xa0\xa0${params.value}`;
	}

	function schoolValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return application.schools.map((s) => s.name).join(' | ');
	}

	function _getSchoolRanking(schools: School[], year: number, rankingName: string): number | null {
		// if more than one school, there is no ranking to speak of
		if (schools.length > 1) {
			return null;
		}
		const latestRanking = getLatestRanking(schools[0], { year, rankingName });
		return latestRanking?.rank ?? null;
	}

	function usNewsRankingGetter(params: ValueGetterParams): number | null {
		return _getSchoolRanking(params.data.schools, params.data.year, 'US News');
	}

	function qsRankingGetter(params: ValueGetterParams): number | null {
		return _getSchoolRanking(params.data.schools, params.data.year, 'QS World');
	}

	function stratPeopleValueGetter(params: ValueGetterParams): string {
		return formatCfNames(params.data.services, '战略顾问');
	}

	function salesPeopleValueGetter(params: ValueGetterParams): string {
		return formatCfNames(params.data.services, '顾问');
	}

	function workPeopleValueGetter(params: ValueGetterParams): string {
		return formatCfNames(params.data.services, '文案');
	}

	function salesAssistantsValueGetter(params: ValueGetterParams): string {
		return formatCfNames(params.data.services, '服务顾问');
	}

	function workAssistantsValueGetter(params: ValueGetterParams): string {
		return formatCfNames(params.data.services, '流程顾问');
	}

	function enrollmentsValueGetter(params: ValueGetterParams): string {
		return formatEnrollments(params.data.student.enrollments);
	}

	function _enrollmentsGetter(params: ValueGetterParams): StudentEnrollmentItem[] {
		return params.data.student.enrollments;
	}

	function satOrActValueGetter(params: ValueGetterParams): string {
		return getSatOrAct(params.data.student.scores);
	}

	function apValueGetter(params: ValueGetterParams): string {
		return formatApSummary(params.data.student.ap_summary);
	}

	function ibValueGetter(params: ValueGetterParams): string {
		return formatIbSummary(params.data.student.ib_summary);
	}

	function alevelValueGetter(params: ValueGetterParams): string {
		return formatAlevelSummary(params.data.student.alevel_summary);
	}

	function greOrGmatValueGetter(params: ValueGetterParams): string {
		return getGreOrGmat(params.data.student.scores);
	}

	function englishValueGetter(params: ValueGetterParams): string {
		return getEnglishProficiency(params.data.student.scores);
	}

	function statusValueGetter(params: ValueGetterParams): string {
		return formatNotableStatuses(getNotableStatuses(params.data));
	}

	function statusDateValueGetter(params: ValueGetterParams): string {
		return getLatestLog(params.data)?.date ?? '';
	}

	function academyValueGetter(params: ValueGetterParams): string {
		return getAcademyPrograms(params.data.student, '');
	}

	function clubsValueGetter(params: ValueGetterParams): string {
		return getAcademyPrograms(params.data.student, 'club');
	}

	const columnTypes = {
		numeric: {
			filter: 'agNumberColumnFilter'
		}
	};

	const secondarySchoolGradeColumns = [
		{ headerName: 'G9 GPA', valueGetter: gradeValueGetter(_enrollmentsGetter, 'G9') },
		{ headerName: 'G10 GPA', valueGetter: gradeValueGetter(_enrollmentsGetter, 'G10') },
		{ headerName: 'G11 GPA', valueGetter: gradeValueGetter(_enrollmentsGetter, 'G11') },
		{ headerName: 'G12 GPA', valueGetter: gradeValueGetter(_enrollmentsGetter, 'G12') }
	];
	const secondarySchoolGradeColumnVisibility = {
		'G9 GPA': false,
		'G10 GPA': false,
		'G11 GPA': false,
		'G12 GPA': false
	};

	const universityGradeColumns = [
		{ headerName: 'Year 1 GPA', valueGetter: gradeValueGetter(_enrollmentsGetter, 'Year 1') },
		{ headerName: 'Year 2 GPA', valueGetter: gradeValueGetter(_enrollmentsGetter, 'Year 2') },
		{ headerName: 'Year 3 GPA', valueGetter: gradeValueGetter(_enrollmentsGetter, 'Year 3') },
		{ headerName: 'Year 4 GPA', valueGetter: gradeValueGetter(_enrollmentsGetter, 'Year 4') }
	];
	const universityGradeColumnVisibility = {
		'Year 1 GPA': false,
		'Year 2 GPA': false,
		'Year 3 GPA': false,
		'Year 4 GPA': false
	};

	let gradeColumns;
	let gradeColumnVisibility;

	if (data.applicationType === 'freshman') {
		gradeColumns = secondarySchoolGradeColumns;
		gradeColumnVisibility = secondarySchoolGradeColumnVisibility;
	} else if (data.applicationType === 'graduate') {
		gradeColumns = universityGradeColumns;
		gradeColumnVisibility = universityGradeColumnVisibility;
	} else {
		gradeColumns = [...secondarySchoolGradeColumns, ...universityGradeColumns];
		gradeColumnVisibility = {
			...secondarySchoolGradeColumnVisibility,
			...universityGradeColumnVisibility
		};
	}

	const columnDefs = [
		{
			headerName: 'Link',
			field: 'id',
			flex: 0.5,
			minWidth: 60,
			sortable: false,
			filter: false,
			cellRenderer: IdRenderer
		},
		{ headerName: 'Year', field: 'year', type: 'numeric', headerTooltip: 'Year of admission' },
		{ headerName: 'Term', field: 'term' },
		{ headerName: 'Student', field: 'student.fullname', flex: 1.2, comparator: localeComparator },
		{ headerName: 'Gender', field: 'student.gender', cellRenderer: GenderRenderer, flex: 0.8 },
		{
			headerName: 'Citizenship',
			field: 'student.citizenship',
			valueFormatter: citizenshipValueFormatter,
			useValueFormatterForExport: false
		},
		{ headerName: '战略顾问', valueGetter: stratPeopleValueGetter },
		{ headerName: '顾问', valueGetter: salesPeopleValueGetter },
		{ headerName: '文案', valueGetter: workPeopleValueGetter, flex: 1.2 },
		{ headerName: '服务顾问', valueGetter: salesAssistantsValueGetter },
		{ headerName: '流程顾问', valueGetter: workAssistantsValueGetter },
		{ headerName: 'Edu. History', valueGetter: enrollmentsValueGetter, flex: 2 },
		...gradeColumns,
		{ headerName: 'SAT/ACT', valueGetter: satOrActValueGetter },
		{ headerName: 'SAT', field: 'student.scores.super_sat', type: ['numeric', 'rightAligned'] },
		{ headerName: 'ACT', field: 'student.scores.super_act', type: ['numeric', 'rightAligned'] },
		{ headerName: 'AP', valueGetter: apValueGetter },
		{ headerName: 'IB', valueGetter: ibValueGetter },
		{ headerName: 'A-level', valueGetter: alevelValueGetter },
		{ headerName: 'GRE/GMAT', valueGetter: greOrGmatValueGetter },
		{ headerName: 'GRE', field: 'student.scores.best_gre', type: ['numeric', 'rightAligned'] },
		{ headerName: 'GMAT', field: 'student.scores.best_gmat', type: ['numeric', 'rightAligned'] },
		{ headerName: 'LSAT', field: 'student.scores.best_lsat', type: ['numeric', 'rightAligned'] },
		{ headerName: 'Eng. Proficiency', valueGetter: englishValueGetter },
		{ headerName: 'TOEFL', field: 'student.scores.best_toefl', type: ['numeric', 'rightAligned'] },
		{ headerName: 'IELTS', field: 'student.scores.best_ielts', type: ['numeric', 'rightAligned'] },
		{
			headerName: 'Duolingo',
			field: 'student.scores.best_duolingo',
			type: ['numeric', 'rightAligned']
		},
		{ headerName: 'School', valueGetter: schoolValueGetter, flex: 3 },
		{
			headerName: 'US News Rank',
			valueGetter: usNewsRankingGetter,
			type: ['numeric', 'rightAligned']
		},
		{ headerName: 'QS Rank', valueGetter: qsRankingGetter, type: ['numeric', 'rightAligned'] },
		{ headerName: 'Program', field: 'program.display_name', flex: 3 },
		{ headerName: 'Major/Track', field: 'majors_or_track', flex: 2 },
		{ headerName: 'Adm. Plan', field: 'round_name', headerTooltip: 'Admission plan' },
		{ headerName: 'Due', field: 'due_date', flex: 1.5 },
		{
			headerName: 'Status',
			valueGetter: statusValueGetter,
			cellRenderer: StatusRenderer,
			flex: 1.2,
			headerTooltip: 'Latest status of the application'
		},
		{
			headerName: 'Last Updated',
			valueGetter: statusDateValueGetter,
			flex: 1.5,
			headerTooltip: 'Date of the latest status'
		},
		{
			headerName: 'CF Academy',
			valueGetter: academyValueGetter,
			valueFormatter: mixedLanguageFormatter,
			useValueFormatterForExport: false,
			flex: 1.2
		},
		{
			headerName: 'CF Clubs',
			valueGetter: clubsValueGetter,
			valueFormatter: mixedLanguageFormatter,
			useValueFormatterForExport: false,
			flex: 1.2
		}
	];

	let columnVisibility: Record<string, boolean>;

	columnVisibility = {
		Link: true,
		Year: !data.year,
		Term: false,
		Student: true,
		Gender: false,
		Citizenship: false,
		战略顾问: false,
		顾问: true,
		文案: true,
		服务顾问: false,
		流程顾问: false,
		'Edu. History': true,
		...gradeColumnVisibility,
		'SAT/ACT': false,
		SAT: false,
		ACT: false,
		AP: false,
		IB: false,
		'A-level': false,
		'GRE/GMAT': false,
		GRE: false,
		GMAT: false,
		LSAT: false,
		'Eng. Proficiency': false,
		TOEFL: false,
		IELTS: false,
		Duolingo: false,
		School: true,
		'US News Rank': false,
		'QS Rank': false,
		Program: data.applicationType !== 'freshman' && data.applicationType !== 'transfer',
		'Major/Track': data.applicationType !== 'graduate' && data.applicationType !== 'other',
		'Adm. Plan': true,
		Due: true,
		Status: true,
		'Last Updated': false,
		'CF Academy': false,
		'CF Clubs': false
	};

	let gridApi: GridApi;
	let rowCount: number | undefined;
	const hideControl = writable(true);

	const showDisplayedRowCount = () => {
		if (gridApi) {
			rowCount = gridApi.getDisplayedRowCount();
		}
	};

	onMount(async () => {
		const [applications, applicants] = await Promise.all([data.applications, data.applicants]);

		if (!applications.length) {
			return;
		}

		const rowData = compose(applications, applicants).sort((a, b) => orderByStatusDateDesc(a, b));

		const gridOptions: GridOptions = {
			defaultColDef: {
				filter: true,
				flex: 1,
				minWidth: 100
			},
			columnTypes,
			columnDefs,
			rowData,
			onFilterChanged: showDisplayedRowCount,
			onModelUpdated: showDisplayedRowCount,
			...agGridOptions
		};
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		gridApi = createGrid(gridElement, gridOptions);

		for (const headerName in columnVisibility) {
			showColumn(gridApi, headerName, columnVisibility[headerName]);
		}

		gridApi.addEventListener('columnMoved', (event: ColumnMovedEvent) => {
			if (event.finished) {
				const key: string = event.column?.getColDef().headerName!;
				const toIndex: number = event.toIndex!;
				columnVisibility = { ...moveColumnVisibilityKey(columnVisibility, key, toIndex) };
			}
		});

		gridApi.addEventListener('columnVisible', (event: ColumnVisibleEvent) => {
			const key: string = event.column?.getColDef().headerName!;
			columnVisibility[key] = event.visible!;
			columnVisibility = { ...columnVisibility };
		});
	});
</script>

<Heading tag="h1" class="grid-title flex gap-2 items-center justify-between">
	<div class="flex gap-4 items-center">
		Applications:
		{#if data.pending}
			Pending
		{:else if data.year && data.applicationType}
			{formatApplicationType(data.applicationType)} {data.year}
		{:else}
			All
		{/if}
		<RowCountBadge rows={data.applications} {rowCount} />
		<ControlButton {hideControl} />
	</div>

	{#await Promise.all([data.applications, data.applicants]) then _}
		<DownloadButton {gridApi} fileName="cf_applications" />
	{/await}
</Heading>

{#await Promise.all([data.applications, data.applicants])}
	<FetchingDataSign />
{:then [applications, _]}
	{#if applications.length}
		<div id="grid" class="data-grid ag-theme-alpine full-page" />
	{:else}
		<NoDataSign text="No applications in this category" />
	{/if}
{/await}

<ControlDrawer {gridApi} {columnVisibility} {hideControl} />
