<script lang="ts">
	import { onMount } from 'svelte';
	import { Badge, Heading } from 'flowbite-svelte';

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
	import { localeComparator } from '$lib/utils/gridUtils';
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import GridButtons from '$lib/components/grid-pages/GridButtons.svelte';

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

	function noZeroValueFormatter(params: ValueFormatterParams): string {
		return params.value === 0 ? '' : params.value;
	}

	function successRateValueGetter(params: ValueGetterParams): number | string {
		const { accepted, failed } = params.data.application_stats;
		const successRate = accepted / (accepted + failed);
		return isNaN(successRate) ? '' : successRate;
	}

	function successRateValueFormatter(params: ValueFormatterParams): string {
		if (typeof params.value !== 'number') {
			return '';
		} else {
			return `${(params.value * 100).toFixed(1)}%`;
		}
	}

	const columnTypes = {
		stats: {
			valueFormatter: noZeroValueFormatter
		}
	};

	const columnDefs = [
		{
			headerName: 'Name',
			field: 'name',
			width: 500,
			flex: 4,
			cellRenderer: NameRenderer,
			comparator: localeComparator
		},
		{ headerName: 'Alt. name', field: 'alt_name', flex: 1.5 },
		{
			headerName: 'Country',
			field: 'country',
			flex: 1.5,
			valueFormatter: countryValueFormatter
		},
		{ headerName: 'Applied', field: 'application_stats.applied', type: ['rightAligned', 'stats'] },
		{ headerName: 'Pending', field: 'application_stats.pending', type: ['rightAligned', 'stats'] },
		{
			headerName: 'Accepted',
			field: 'application_stats.accepted',
			type: ['rightAligned', 'stats']
		},
		{ headerName: 'Failed', field: 'application_stats.failed', type: ['rightAligned', 'stats'] },
		{
			headerName: 'Aborted/Untracked',
			field: 'application_stats.neutral',
			flex: 1.5,
			type: ['rightAligned', 'stats']
		},
		{
			headerName: 'Success rate',
			flex: 1.2,
			valueGetter: successRateValueGetter,
			valueFormatter: successRateValueFormatter,
			type: 'rightAligned'
		}
	];

	let gridApi: GridApi;

	const exportAsCsv = () => {
		gridApi!.exportDataAsCsv({ fileName: 'cf_schools' });
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
			...agGridOptions
		};
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		gridApi = createGrid(gridElement, gridOptions);
	});
</script>

<Heading tag="h1" class="grid-title flex gap-8 items-center justify-between">
	<div class="flex gap-4 items-center">
		{data.schoolType}
		{#await data.schools then schools}
			{#if schools.length}
				<Badge>{schools.length}</Badge>
			{/if}
		{/await}
	</div>

	{#await data.schools then _}
		<GridButtons onDownload={exportAsCsv} onConfig={() => alert('config')} />
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
