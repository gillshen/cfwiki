<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Heading } from 'flowbite-svelte';

	import {
		createGrid,
		type GridApi,
		type GridOptions,
		type ICellRendererParams,
		type ValueFormatterParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import type { SchoolWithStats } from '$lib/api/school';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { AgCellRenderer } from '$lib/abstract/agCellRenderer';
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import ControlButton from '$lib/components/grid-pages/ControlButton.svelte';
	import ControlDrawer from '$lib/components/grid-pages/ControlDrawer.svelte';
	import DownloadButton from '$lib/components/grid-pages/DownloadButton.svelte';

	import {
		localeComparator,
		calcSuccessRate,
		noZeroValueFormatter,
		percentageValueFormatter,
		showColumn
	} from '$lib/utils/gridUtils';

	export let data: {
		schools: Promise<SchoolWithStats[]>;
		schoolType: string;
	};

	class NameRenderer extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			const school: SchoolWithStats = params.data;
			this.eGui.href = `/school/${school.id}/`;
			this.eGui.innerHTML = school.name;
		}
	}

	function countryValueFormatter(params: ValueFormatterParams): string {
		const flag = countryFlags[params.value];
		return `${flag}\xa0\xa0${params.value}`;
	}

	function ugSuccessRateValueGetter(params: ValueGetterParams): number | string {
		return calcSuccessRate(params.data.application_stats.ug);
	}

	function gradSuccessRateValueGetter(params: ValueGetterParams): number | string {
		return calcSuccessRate(params.data.application_stats.grad);
	}

	const columnTypes = {
		stats: {
			valueFormatter: noZeroValueFormatter
		}
	};

	const columnDefs: any[] = [
		{
			headerName: 'Name',
			field: 'name',
			width: 500,
			flex: 3,
			cellRenderer: NameRenderer,
			comparator: localeComparator
		},
		{ headerName: 'Alt. Name', field: 'alt_name', flex: 1.2 },
		{
			headerName: 'Country',
			field: 'country',
			flex: 1.5,
			valueFormatter: countryValueFormatter
		}
	];

	const statsColumnDefs = [
		{
			headerName: 'UG Applied',
			field: 'application_stats.ug.applied',
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'UG Pending',
			field: 'application_stats.ug.pending',
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'UG Accepted',
			field: 'application_stats.ug.accepted',
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'UG Denied',
			field: 'application_stats.ug.denied',
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'UG Acceptance Rate',
			flex: 1.2,
			valueGetter: ugSuccessRateValueGetter,
			valueFormatter: percentageValueFormatter,
			type: 'rightAligned'
		},
		{
			headerName: 'UG Cancelled, etc.',
			field: 'application_stats.ug.neutral',
			flex: 1.2,
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'Grad Applied',
			field: 'application_stats.grad.applied',
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'Grad Pending',
			field: 'application_stats.grad.pending',
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'Grad Accepted',
			field: 'application_stats.grad.accepted',
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'Grad Denied',
			field: 'application_stats.grad.denied',
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'Grad Acceptance Rate',
			flex: 1.2,
			valueGetter: gradSuccessRateValueGetter,
			valueFormatter: percentageValueFormatter,
			type: 'rightAligned'
		},
		{
			headerName: 'Grad Cancelled, etc.',
			field: 'application_stats.grad.neutral',
			flex: 1.2,
			type: ['rightAligned', 'stats']
		}
	];

	const columnVisibility: Record<string, boolean> = {
		Name: true,
		'Alt. Name': true,
		Country: true
	};

	const statsColumnVisibility: Record<string, boolean> = {
		'UG Applied': true,
		'UG Pending': false,
		'UG Accepted': true,
		'UG Denied': false,
		'UG Acceptance Rate': true,
		'UG Cancelled, etc.': false,
		'Grad Applied': true,
		'Grad Pending': false,
		'Grad Accepted': true,
		'Grad Denied': false,
		'Grad Acceptance Rate': true,
		'Grad Cancelled, etc.': false
	};

	if (data.schoolType !== 'Secondary Schools') {
		for (const column of statsColumnDefs) {
			columnDefs.push(column);
		}
		for (const headerName in statsColumnVisibility) {
			columnVisibility[headerName] = statsColumnVisibility[headerName];
		}
	}

	let gridApi: GridApi;
	let rowCount: number;
	const hideControl = writable(true);

	const showDisplayedRowCount = () => {
		if (gridApi) {
			rowCount = gridApi.getDisplayedRowCount();
		}
	};

	onMount(async () => {
		const schools = await data.schools;

		if (!schools.length) {
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
			rowData: schools.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
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
		{data.schoolType}
		<RowCountBadge promisedData={data.schools} {rowCount} />
		<ControlButton {hideControl} />
	</div>

	{#await data.schools then _}
		<DownloadButton {gridApi} fileName="cf_schools" />
	{/await}
</Heading>

{#await data.schools}
	<FetchingDataSign />
{:then schools}
	{#if schools.length}
		<div id="grid" class="data-grid ag-theme-alpine full-page" />
	{:else}
		<NoDataSign text="No schools in this category" />
	{/if}
{/await}

<ControlDrawer {gridApi} {columnVisibility} {hideControl} />
