<script lang="ts">
	import { onMount } from 'svelte';
	import { Badge, Heading } from 'flowbite-svelte';

	import {
		createGrid,
		type GridApi,
		type GridOptions,
		type ICellRendererParams,
		type ValueFormatterParams
	} from 'ag-grid-community';

	import type { School } from '$lib/api/school';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { AgCellRenderer } from '$lib/abstract/agCellRenderer';
	import { localeComparator } from '$lib/utils/gridUtils';
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import GridButtons from '$lib/components/grid-pages/GridButtons.svelte';

	export let data: {
		schools: Promise<School[]>;
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

	const columnDefs = [
		{
			headerName: 'Name',
			field: 'name',
			width: 500,
			flex: 5,
			cellRenderer: NameRenderer,
			comparator: localeComparator
		},
		{ headerName: 'Alt. name', field: 'alt_name', flex: 2 },
		{
			headerName: 'Country',
			field: 'country',
			flex: 2,
			valueFormatter: countryValueFormatter,
			useValueFormatterForExport: false
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
			defaultColDef: { filter: true },
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
