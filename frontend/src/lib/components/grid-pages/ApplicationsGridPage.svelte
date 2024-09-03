<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Heading } from 'flowbite-svelte';

	import {
		createGrid,
		type GridApi,
		type GridOptions,
		type ICellRendererParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import type { ApplicantListItem, ApplicationListItem } from '$lib/api/application';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { SvelteCellRenderer } from '$lib/abstract/agCellRenderer';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import IdLink from '$lib/components/grid-cells/IdLink.svelte';
	import ApplicationStatus from '$lib/components/grid-cells/ApplicationStatus.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import ControlButton from '$lib/components/grid-pages/ControlButton.svelte';
	import ControlDrawer from '$lib/components/grid-pages/ControlDrawer.svelte';
	import DownloadButton from '$lib/components/grid-pages/DownloadButton.svelte';
	import { formatAlevelSummary, formatApSummary, formatIbSummary } from '$lib/utils/studentUtils';
	import { compose, formatApplicationType } from '$lib/utils/applicationUtils';
	import { formatCfNames } from '$lib/utils/serviceUtils';

	import {
		getEnglishProficiency,
		getGreOrGmat,
		getSatOrAct,
		localeComparator,
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

	class StatusRenderer extends SvelteCellRenderer {
		createComponent(params: ICellRendererParams): void {
			this.component = new ApplicationStatus({
				target: this.eGui,
				props: { application: params.data }
			});
		}
	}

	function schoolValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return application.schools.map((s) => s.name).join(' | ');
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

	const columnTypes = {
		numeric: {
			filter: 'agNumberColumnFilter'
		}
	};

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
		{ headerName: '战略顾问', valueGetter: stratPeopleValueGetter },
		{ headerName: '顾问', valueGetter: salesPeopleValueGetter },
		{ headerName: '文案', valueGetter: workPeopleValueGetter, flex: 1.2 },
		{ headerName: '服务顾问', valueGetter: salesAssistantsValueGetter },
		{ headerName: '流程顾问', valueGetter: workAssistantsValueGetter },
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
		{ headerName: 'Program', field: 'program.display_name', flex: 3 },
		{ headerName: 'Major/Track', field: 'majors_or_track', flex: 2 },
		{ headerName: 'Adm. Plan', field: 'round_name', headerTooltip: 'Admission plan' },
		{ headerName: 'Due', field: 'due_date', flex: 1.5 },
		{
			headerName: 'Status',
			field: 'latest_log.status',
			cellRenderer: StatusRenderer,
			headerTooltip: 'Latest status of the application'
		},
		{
			headerName: 'Last Update',
			field: 'latest_log.date',
			flex: 1.5,
			headerTooltip: 'The (approximate) date when the application assumed its latest status'
		}
	];

	const columnVisibility: Record<string, boolean> = {
		Link: true,
		Year: !data.year,
		Term: false,
		Student: true,
		战略顾问: false,
		顾问: true,
		文案: true,
		服务顾问: false,
		流程顾问: false,
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
		Program: data.applicationType !== 'freshman' && data.applicationType !== 'transfer',
		'Major/Track': data.applicationType !== 'graduate' && data.applicationType !== 'other',
		'Adm. Plan': true,
		Due: true,
		Status: true,
		'Last Update': false
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

		const rowData = compose(applications, applicants);

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
