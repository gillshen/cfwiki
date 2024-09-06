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
		type ValueGetterParams
	} from 'ag-grid-community';

	import type { ProgramListItem, ProgramStats } from '$lib/api/program';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { SvelteCellRenderer } from '$lib/abstract/agCellRenderer';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import RowCountBadge from '$lib/components/grid-pages/RowCountBadge.svelte';
	import ControlButton from '$lib/components/grid-pages/ControlButton.svelte';
	import ControlDrawer from '$lib/components/grid-pages/ControlDrawer.svelte';
	import DownloadButton from '$lib/components/grid-pages/DownloadButton.svelte';
	import IdLink from '$lib/components/grid-cells/IdLink.svelte';
	import { compose, formatSchoolNames } from '$lib/utils/programUtils';
	import { lexicalChineseLast } from '$lib/utils/stringUtils';

	import {
		calcSuccessRate,
		noZeroValueFormatter,
		percentageValueFormatter,
		moveColumnVisibilityKey,
		showColumn
	} from '$lib/utils/gridUtils';

	export let data: {
		programs: Promise<ProgramListItem[]>;
		stats: Promise<ProgramStats[]>;
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

	function successRateValueGetter(params: ValueGetterParams): number | null {
		return calcSuccessRate(params.data.stats);
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
		{
			headerName: 'Applied',
			field: 'stats.applied',
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Total number of applications'
		},
		{ headerName: 'Pending', field: 'stats.pending', type: ['numericColumn', 'stats'] },
		{
			headerName: 'Accepted',
			field: 'stats.accepted',
			type: ['numericColumn', 'stats']
		},
		{
			headerName: 'Denied',
			field: 'stats.denied',
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Including presumed rejections and offer rescissions'
		},
		{
			headerName: 'Acceptance Rate',
			flex: 1.2,
			valueGetter: successRateValueGetter,
			valueFormatter: percentageValueFormatter,
			type: 'numericColumn',
			filter: 'agNumberColumnFilter',
			headerTooltip: 'Applied / (Applied + Denied)'
		},
		{
			headerName: 'Cancelled, etc.',
			field: 'stats.neutral',
			flex: 1.2,
			type: ['numericColumn', 'stats'],
			headerTooltip: 'Cancelled, withdrawn, or untracked'
		}
	];

	let columnVisibility: Record<string, boolean>;

	columnVisibility = {
		Link: true,
		Type: true,
		School: true,
		Name: data.programType !== 'Undergraduate',
		Degree: data.programType !== 'Undergraduate',
		Applied: true,
		Pending: true,
		Accepted: true,
		Denied: true,
		'Acceptance Rate': true,
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
		const [programs, stats] = await Promise.all([data.programs, data.stats]);

		if (!programs.length) {
			return;
		}

		const rowData = compose(programs, stats).sort((a, b) =>
			lexicalChineseLast(a.display_name, b.display_name)
		);

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

<Heading tag="h1" class="grid-title flex gap-8 items-center justify-between">
	<div class="flex gap-4 items-center">
		{`${data.programType} Programs`}
		<RowCountBadge rows={data.programs} {rowCount} />
		<ControlButton {hideControl} />
	</div>

	{#await Promise.all([data.programs, data.stats]) then _}
		<DownloadButton {gridApi} fileName="cf_programs" />
	{/await}
</Heading>

{#await Promise.all([data.programs, data.stats])}
	<FetchingDataSign />
{:then [programs, _]}
	{#if programs.length}
		<div id="grid" class="data-grid ag-theme-alpine full-page" />
	{:else}
		<NoDataSign text="No programs in this category" />
	{/if}
{/await}

<ControlDrawer {gridApi} {columnVisibility} {hideControl} />
