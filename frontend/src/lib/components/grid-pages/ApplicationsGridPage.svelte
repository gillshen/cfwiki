<script lang="ts">
	import { onMount } from 'svelte';
	import { Heading } from 'flowbite-svelte';

	import {
		createGrid,
		NumberFilter,
		type GridApi,
		type GridOptions,
		type ICellRendererParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import type { ApplicationListItem } from '$lib/api/application';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { SvelteCellRenderer } from '$lib/abstract/agCellRenderer';
	import { formatApplicationType } from '$lib/utils/applicationUtils';
	import { formatCfNames } from '$lib/utils/serviceUtils';
	import { localeComparator } from '$lib/utils/gridUtils';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import IdLink from '$lib/components/grid-cells/IdLink.svelte';
	import ApplicationStatus from '$lib/components/grid-cells/ApplicationStatus.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import GridButtons from '$lib/components/grid-pages/GridButtons.svelte';

	export let data: {
		applications: Promise<ApplicationListItem[]>;
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
		{
			headerName: 'Year',
			field: 'program_iteration.year',
			filter: NumberFilter,
			hide: data.year !== undefined
		},
		{ headerName: 'Term', field: 'program_iteration.term', hide: true },
		{ headerName: 'Student', field: 'student.fullname', flex: 1.5, comparator: localeComparator },
		{ headerName: '战略', valueGetter: stratPeopleValueGetter },
		{ headerName: '顾问', valueGetter: salesPeopleValueGetter },
		{ headerName: '文案', valueGetter: workPeopleValueGetter, flex: 1.2 },
		{ headerName: '服务', valueGetter: salesAssistantsValueGetter },
		{ headerName: '流程', valueGetter: workAssistantsValueGetter, hide: true },
		{ headerName: 'School', valueGetter: schoolValueGetter, flex: 3 },
		{
			headerName: 'Program',
			field: 'program.display_name',
			flex: 3,
			hide: data.applicationType === 'freshman' || data.applicationType === 'transfer'
		},
		{ headerName: 'Major/Track', field: 'majors_or_track', flex: 2 },
		{ headerName: 'Adm. plan', field: 'round.name' },
		{ headerName: 'Due', field: 'round.due_date', flex: 1.5 },
		{ headerName: 'Status', field: 'latest_log.status', cellRenderer: StatusRenderer },
		{ headerName: 'Last update', field: 'latest_log.date', flex: 1.5 }
	];

	let gridApi: GridApi;
	let rowCount: number;

	const showDisplayedRowCount = () => {
		if (gridApi) {
			rowCount = gridApi.getDisplayedRowCount();
		}
	};

	const exportAsCsv = () => {
		gridApi!.exportDataAsCsv({ fileName: 'cf_applications' });
	};

	onMount(async () => {
		const applications = await data.applications;

		if (!applications.length) {
			return;
		}

		const gridOptions: GridOptions = {
			defaultColDef: {
				filter: true,
				flex: 1,
				minWidth: 100
			},
			columnDefs,
			rowData: applications,
			onFilterChanged: showDisplayedRowCount,
			onModelUpdated: showDisplayedRowCount,
			...agGridOptions
		};
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		gridApi = createGrid(gridElement, gridOptions);
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

		<RowCountBadge promisedData={data.applications} {rowCount} />
	</div>

	{#await data.applications then _}
		<GridButtons onDownload={exportAsCsv} onConfig={() => alert('config')} />
	{/await}
</Heading>

{#await data.applications}
	<FetchingDataSign />
{:then applications}
	{#if applications.length}
		<div id="grid" class="data-grid ag-theme-alpine full-page" />
	{:else}
		<NoDataSign text="No applications in this category" />
	{/if}
{/await}
