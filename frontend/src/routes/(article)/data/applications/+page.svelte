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

	import type { ApplicationListItem } from '$lib/api/application';
	import { agGridOptions } from '$lib/abstract/agGridOptions';
	import { SvelteCellRenderer } from '$lib/abstract/agCellRenderer';
	import { formatMajors } from '$lib/utils/applicationUtils';
	import { formatCfNames } from '$lib/utils/serviceUtils';
	import { localeComparator } from '$lib/utils/gridUtils';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import ApplicationLink from '$lib/components/grid-cells/ApplicationLink.svelte';
	import ApplicationStatus from '$lib/components/grid-cells/ApplicationStatus.svelte';

	export let data;

	class IdRenderer extends SvelteCellRenderer {
		createComponent(params: ICellRendererParams): void {
			this.component = new ApplicationLink({
				target: this.eGui,
				props: { application: params.data }
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

	function majorValueGetter(params: ValueGetterParams): string {
		return formatMajors(params.data);
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
			minWidth: 60,
			sortable: false,
			filter: false,
			cellRenderer: IdRenderer
		},
		{ headerName: 'Year', field: 'program_iteration.year', filter: NumberFilter },
		{ headerName: 'Term', field: 'program_iteration.term' },
		{ headerName: 'Student', field: 'student.fullname', comparator: localeComparator },
		{ headerName: '战略', valueGetter: stratPeopleValueGetter },
		{ headerName: '顾问', valueGetter: salesPeopleValueGetter },
		{ headerName: '文案', valueGetter: workPeopleValueGetter },
		{ headerName: '服务', valueGetter: salesAssistantsValueGetter },
		{ headerName: '流程', valueGetter: workAssistantsValueGetter },
		{ headerName: 'School', valueGetter: schoolValueGetter, flex: 1 },
		{ headerName: 'Program', field: 'program.display_name' },
		{ headerName: 'Major', valueGetter: majorValueGetter, flex: 1 },
		{ headerName: 'Round', field: 'round.name' },
		{ headerName: 'Due', field: 'round.due_date' },
		{ headerName: 'Status', field: 'latest_log.status', cellRenderer: StatusRenderer },
		{ headerName: 'Last update', field: 'latest_log.date' }
	];

	onMount(async () => {
		const applications = await data.applications;
		const gridOptions: GridOptions = {
			defaultColDef: { filter: true },
			columnDefs,
			rowData: applications,
			...agGridOptions
		};
		const gridElement: HTMLElement = document.querySelector('#grid')!;
		const gridApi = createGrid(gridElement, gridOptions);
		gridApi.autoSizeAllColumns();
	});
</script>

<Heading tag="h1" class="grid-title">Applications</Heading>

{#await data.applications}
	<FetchingDataSign />
{:then _}
	<div id="grid" class="data-grid ag-theme-alpine full-page" />
{/await}
