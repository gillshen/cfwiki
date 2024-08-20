<script lang="ts">
	import { onMount } from 'svelte';

	import {
		createGrid,
		type GridOptions,
		type ICellRendererParams,
		type ValueFormatterParams
	} from 'ag-grid-community';

	import { Heading } from 'flowbite-svelte';

	import type { School } from '$lib/api/school';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { AgCellRenderer } from '$lib/abstract/agCellRenderer';
	import { localeComparator } from '$lib/utils/gridUtils';
	import countryFlags from '$lib/constants/countryFlags';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';

	export let data;

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
		{ headerName: 'Name', field: 'name', cellRenderer: NameRenderer, comparator: localeComparator },
		{ headerName: 'Alt. name', field: 'alt_name' },
		{ headerName: 'Type', field: 'type' },
		{ headerName: 'Country', field: 'country', valueFormatter: countryValueFormatter }
	];

	onMount(async () => {
		const schools = await data.schools;
		const gridOptions: GridOptions = {
			defaultColDef: { filter: true },
			columnDefs,
			rowData: schools.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
			...agGridOptions
		};
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		const gridApi = createGrid(gridElement, gridOptions);
		gridApi.sizeColumnsToFit();
	});
</script>

<Heading tag="h1" class="grid-title">Schools</Heading>

{#await data.schools}
	<FetchingDataSign />
{:then _}
	<div id="grid" class="data-grid ag-theme-alpine full-page" />
{/await}
