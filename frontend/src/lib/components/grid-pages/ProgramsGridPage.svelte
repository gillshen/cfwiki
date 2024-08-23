<script lang="ts">
	import { onMount } from 'svelte';
	import { Heading } from 'flowbite-svelte';

	import {
		createGrid,
		type GridApi,
		type GridOptions,
		type ICellRendererParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import type { ProgramWithStats } from '$lib/api/program';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { SvelteCellRenderer } from '$lib/abstract/agCellRenderer';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import GridButtons from '$lib/components/grid-pages/GridButtons.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import IdLink from '$lib/components/grid-cells/IdLink.svelte';
	import { formatSchoolNames } from '$lib/utils/programUtils';

	import {
		calcSuccessRate,
		noZeroValueFormatter,
		percentageValueFormatter
	} from '$lib/utils/gridUtils';

	export let data: {
		programs: Promise<ProgramWithStats[]>;
		programType: string;
	};

	class IdRenderer extends SvelteCellRenderer {
		createComponent(params: ICellRendererParams): void {
			this.component = new IdLink({
				target: this.eGui,
				props: { entity: params.data, path: '/program' }
			});
		}
	}

	function programTypeValueGetter(params: ValueGetterParams): string {
		if (params.data.type === 'UG Freshman') {
			return 'Freshman';
		} else if (params.data.type === 'UG Transfer') {
			return 'Transfer';
		} else {
			return params.data.type;
		}
	}

	function schoolsGetter(params: ValueGetterParams): string {
		return formatSchoolNames(params.data);
	}

	function successRateValueGetter(params: ValueGetterParams): number | string {
		return calcSuccessRate(params.data.application_stats);
	}

	const columnTypes = {
		stats: {
			valueFormatter: noZeroValueFormatter
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
		{ headerName: 'Type', field: 'type', valueGetter: programTypeValueGetter },
		{ headerName: 'School', field: 'schools', flex: 2.5, valueGetter: schoolsGetter },
		{ headerName: 'Name', field: 'name', flex: 2.5, hide: data.programType === 'Undergraduate' },
		{
			headerName: 'Degree',
			field: 'degree',
			flex: 1.8,
			hide: data.programType === 'Undergraduate'
		},

		{ headerName: 'Applied', field: 'application_stats.applied', type: ['rightAligned', 'stats'] },
		{ headerName: 'Pending', field: 'application_stats.pending', type: ['rightAligned', 'stats'] },
		{
			headerName: 'Accepted',
			field: 'application_stats.accepted',
			type: ['rightAligned', 'stats']
		},
		{ headerName: 'Denied', field: 'application_stats.denied', type: ['rightAligned', 'stats'] },

		{
			headerName: 'Acceptance rate',
			flex: 1.2,
			valueGetter: successRateValueGetter,
			valueFormatter: percentageValueFormatter,
			type: 'rightAligned'
		},
		{
			headerName: 'Cancelled, etc.',
			field: 'application_stats.neutral',
			flex: 1.2,
			type: ['rightAligned', 'stats']
		}
	];

	let gridApi: GridApi;
	let rowCount: number;

	const showDisplayedRowCount = () => {
		if (gridApi) {
			rowCount = gridApi.getDisplayedRowCount();
		}
	};
	const exportAsCsv = () => {
		gridApi!.exportDataAsCsv({ fileName: 'cf_programs' });
	};

	onMount(async () => {
		const programs = await data.programs;

		if (!programs.length) {
			return;
		}

		const gridOptions: GridOptions = {
			defaultColDef: {
				filter: true,
				flex: 1,
				minWidth: 100,
				useValueFormatterForExport: false
			},
			columnTypes,
			columnDefs,
			rowData: programs.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
			onFilterChanged: showDisplayedRowCount,
			onModelUpdated: showDisplayedRowCount,
			...agGridOptions
		};
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		gridApi = createGrid(gridElement, gridOptions);
	});
</script>

<Heading tag="h1" class="grid-title flex gap-8 items-center justify-between">
	<div class="flex gap-4 items-center">
		{`${data.programType} Programs`}
		<RowCountBadge promisedData={data.programs} {rowCount} />
	</div>

	{#await data.programs then _}
		<GridButtons onDownload={exportAsCsv} onConfig={() => alert('config')} />
	{/await}
</Heading>

{#await data.programs}
	<FetchingDataSign />
{:then programs}
	{#if programs.length}
		<div id="grid" class="data-grid ag-theme-alpine full-page" />
	{:else}
		<NoDataSign text="No programs in this category" />
	{/if}
{/await}
