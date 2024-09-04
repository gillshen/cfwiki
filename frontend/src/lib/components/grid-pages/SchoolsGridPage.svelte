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

	import type { School, SchoolStats } from '$lib/api/school';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { AgCellRenderer } from '$lib/abstract/agCellRenderer';
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import ControlButton from '$lib/components/grid-pages/ControlButton.svelte';
	import ControlDrawer from '$lib/components/grid-pages/ControlDrawer.svelte';
	import DownloadButton from '$lib/components/grid-pages/DownloadButton.svelte';
	import { compose } from '$lib/utils/schoolUtils';
	import { lexicalChineseLast } from '$lib/utils/stringUtils';

	import {
		localeComparator,
		calcSuccessRate,
		noZeroValueFormatter,
		percentageValueFormatter,
		showColumn
	} from '$lib/utils/gridUtils';

	export let data: {
		schools: Promise<School[]>;
		stats: Promise<SchoolStats[]>;
		schoolType: string;
	};

	class NameRenderer extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			const school: School = params.data;
			this.eGui.href = `/school/${school.id}/`;
			this.eGui.innerHTML = school.name;
		}
	}

	function countryValueFormatter(params: ValueFormatterParams): string {
		const flag = countryFlags[params.value];
		return `${flag}\xa0\xa0${params.value}`;
	}

	function ugSuccessRateValueGetter(params: ValueGetterParams): number | null {
		return calcSuccessRate(params.data.ug_stats);
	}

	function gradSuccessRateValueGetter(params: ValueGetterParams): number | null {
		return calcSuccessRate(params.data.grad_stats);
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
			field: 'ug_stats.applied',
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Total number of UG freshman and transfer applications'
		},
		{ headerName: 'UG Pending', field: 'ug_stats.pending', type: ['numericColumn', 'stats'] },
		{ headerName: 'UG Accepted', field: 'ug_stats.accepted', type: ['numericColumn', 'stats'] },
		{
			headerName: 'UG Denied',
			field: 'ug_stats.denied',
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Including presumed rejections and offer rescissions'
		},
		{
			headerName: 'UG Acceptance Rate',
			flex: 1.2,
			valueGetter: ugSuccessRateValueGetter,
			valueFormatter: percentageValueFormatter,
			type: 'numericColumn',
			filter: 'agNumberColumnFilter',
			headerTooltip: 'Applied / (Applied + Denied)'
		},
		{
			headerName: 'UG Cancelled, etc.',
			field: 'ug_stats.neutral',
			flex: 1.2,
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Cancelled, withdrawn, or untracked'
		},
		{
			headerName: 'Grad Applied',
			field: 'grad_stats.applied',
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Total number of graduate applications'
		},
		{ headerName: 'Grad Pending', field: 'grad_stats.pending', type: ['numericColumn', 'stats'] },
		{ headerName: 'Grad Accepted', field: 'grad_stats.accepted', type: ['numericColumn', 'stats'] },
		{
			headerName: 'Grad Denied',
			field: 'grad_stats.denied',
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Including presumed rejections and offer rescissions'
		},
		{
			headerName: 'Grad Acceptance Rate',
			flex: 1.2,
			valueGetter: gradSuccessRateValueGetter,
			valueFormatter: percentageValueFormatter,
			type: 'numericColumn',
			filter: 'agNumberColumnFilter',
			headerTooltip: 'Applied / (Applied + Denied)'
		},
		{
			headerName: 'Grad Cancelled, etc.',
			field: 'grad_stats.neutral',
			flex: 1.2,
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Cancelled, withdrawn, or untracked'
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
		const [schools, stats] = await Promise.all([data.schools, data.stats]);

		if (!schools.length) {
			return;
		}

		const rowData = compose(schools, stats).sort((a, b) => lexicalChineseLast(a.name, b.name));

		const gridOptions: GridOptions = {
			defaultColDef: {
				filter: true,
				flex: 1,
				minWidth: 100,
				useValueFormatterForExport: false
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

<Heading tag="h1" class="grid-title flex gap-8 items-center justify-between">
	<div class="flex gap-4 items-center">
		{data.schoolType}
		<RowCountBadge rows={data.schools} {rowCount} />
		<ControlButton {hideControl} />
	</div>

	{#await Promise.all([data.schools, data.stats]) then _}
		<DownloadButton {gridApi} fileName="cf_schools" />
	{/await}
</Heading>

{#await Promise.all([data.schools, data.stats])}
	<FetchingDataSign />
{:then [schools, _]}
	{#if schools.length}
		<div id="grid" class="data-grid ag-theme-alpine full-page" />
	{:else}
		<NoDataSign text="No schools in this category" />
	{/if}
{/await}

<ControlDrawer {gridApi} {columnVisibility} {hideControl} />
