<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createGrid,
		NumberFilter,
		type GridOptions,
		type ICellRendererParams,
		type ValueGetterParams
	} from 'ag-grid-community';
	import { Heading } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application.js';
	import AgCellRenderer from '$lib/abstract/agCellRenderer.js';

	export let data;

	class IDRenderer extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			const application: ApplicationListItem = params.data;
			this.eGui.href = `/application/${application.id}/`;
			this.eGui.innerHTML = 'Link';
		}
	}

	function schoolValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return application.schools.map((s) => s.name).join(' | ');
	}

	const columnDefs = [
		{ headerName: 'ID', field: 'id', filter: NumberFilter, cellRenderer: IDRenderer },
		{ headerName: 'Student', field: 'student.fullname', filter: true },
		{ headerName: 'School', filter: true, valueGetter: schoolValueGetter },
		{ headerName: 'Program', field: 'program.display_name', filter: true },
		{ headerName: 'Year', field: 'program_iteration.year', filter: NumberFilter },
		{ headerName: 'Term', field: 'program_iteration.term', filter: true },
		{ headerName: 'Round', field: 'round.name', filter: true },
		{ headerName: 'Due', field: 'round.due_date', filter: true },
		{ headerName: 'Status', field: 'latest_log.status', filter: true },
		{ headerName: 'Last update', field: 'latest_log.date', filter: true }
	];

	const gridOptions: GridOptions = {
		columnDefs,
		rowData: data.applications,
		suppressDragLeaveHidesColumns: true
	};

	onMount(() => {
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		const gridApi = createGrid(gridElement, gridOptions);
		gridApi.sizeColumnsToFit();
	});
</script>

<main>
	<Heading tag="h1" class="text-3xl font-bold py-6">Applications</Heading>

	<div id="grid" class="data-grid ag-theme-alpine" />
</main>

<style>
	main {
		padding: 0.5rem 1rem;
	}
	#grid {
		height: calc(100vh - 8rem);
	}
</style>
