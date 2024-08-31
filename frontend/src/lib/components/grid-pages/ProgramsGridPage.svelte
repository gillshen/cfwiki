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

	import type { ProgramWithStats } from '$lib/api/program';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { SvelteCellRenderer } from '$lib/abstract/agCellRenderer';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import ControlButton from '$lib/components/grid-pages/ControlButton.svelte';
	import ControlDrawer from '$lib/components/grid-pages/ControlDrawer.svelte';
	import DownloadButton from '$lib/components/grid-pages/DownloadButton.svelte';
	import IdLink from '$lib/components/grid-cells/IdLink.svelte';
	import { formatSchoolNames } from '$lib/utils/programUtils';

	import {
		calcSuccessRate,
		noZeroValueFormatter,
		percentageValueFormatter,
		showColumn
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
		{ headerName: 'Name', field: 'name', flex: 2.5 },
		{ headerName: 'Degree', field: 'degree' },
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

	const columnVisibility: Record<string, boolean> = {
		Type: true,
		School: true,
		Name: data.programType !== 'Undergraduate',
		Degree: data.programType !== 'Undergraduate',
		Applied: true,
		Pending: true,
		Accepted: true,
		Denied: true,
		'Acceptance rate': true,
		'Cancelled, etc.': false
	};

	let gridApi: GridApi;
	let rowCount: number;
	const hideControl = writable(true);

	const showDisplayedRowCount = () => {
		if (gridApi) {
			rowCount = gridApi.getDisplayedRowCount();
		}
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

		for (const headerName in columnVisibility) {
			showColumn(gridApi, headerName, columnVisibility[headerName]);
		}
	});
</script>

<Heading tag="h1" class="grid-title flex gap-8 items-center justify-between">
	<div class="flex gap-4 items-center">
		{`${data.programType} Programs`}
		<RowCountBadge promisedData={data.programs} {rowCount} />
		<ControlButton {hideControl} />
	</div>

	{#await data.programs then _}
		<DownloadButton {gridApi} fileName="cf_programs" />
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

<ControlDrawer {gridApi} {columnVisibility} {hideControl} />
