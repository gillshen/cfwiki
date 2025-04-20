<script lang="ts">
	import {
		ModuleRegistry,
		AllCommunityModule,
		createGrid,
		themeQuartz,
		type GridApi,
		type GridOptions
	} from 'ag-grid-community';

	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';

	import DismissibleBadge from '$lib/components/misc/DismissibleBadge.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import { SearchParamsManager } from '$lib/util/dataGridUtils';
	import { orderByUsername } from '$lib/util/userUtils.js';

	ModuleRegistry.registerModules([AllCommunityModule]);

	export let data;

	let gridApi: GridApi | null;
	let gridElement: HTMLElement;

	$: cfer = $page.url.searchParams.get('cfer') || 'All';
	$: applicationType = $page.url.searchParams.get('applicationType') || 'All';
	$: year = $page.url.searchParams.get('year') || 'All';
	$: status = $page.url.searchParams.get('status') || 'All';

	const initGrid = async () => {
		gridElement = document.querySelector('#grid')!;
		const applications = await data.applications;
		const gridOptions: GridOptions = {
			defaultColDef: {
				filter: true,
				flex: 1,
				minWidth: 100
			},
			columnDefs,
			rowData: applications,
			theme: themeQuartz
		};
		gridApi = createGrid(gridElement, gridOptions);
	};

	const updateGrid = async () => {
		const applications = await data.applications;
		if (gridApi) {
			gridApi.setGridOption('rowData', applications);
		}
	};

	const paramsManager = new SearchParamsManager(page, updateGrid);

	const columnDefs = [
		{ field: 'id' },
		{ field: 'student.fullname' },
		{ field: 'schools' },
		{ field: 'program.display_name' },
		{ field: 'year' },
		{ field: 'round_name' },
		{ field: 'due_date' }
	];

	afterNavigate(initGrid);
</script>

<section class="py-3 flex items-center gap-4">
	<h1 class="data-grid-title">Applications</h1>
	<div class="flex items-center gap-2 ml-4">
		<select
			class="px-4 py-1 text-sm rounded-md bg-white border-[1px]"
			value={cfer}
			on:change={paramsManager.onSelectInputChange('cfer')}
		>
			<option value="All">Filter by CFer...</option>
			{#each data.cfUsers.filter((u) => u.is_active).sort(orderByUsername) as cfUser}
				<option value={cfUser.username}>{cfUser.username}</option>
			{/each}
		</select>
		<select
			class="px-4 py-1 text-sm rounded-md bg-white border-[1px]"
			value={applicationType}
			on:change={paramsManager.onSelectInputChange('applicationType')}
		>
			<option value="All">Filter by type...</option>
			<option value="freshman">UG Freshman</option>
			<option value="transfer">UG Transfer</option>
			<option value="masters">Master&rsquo;s</option>
			<option value="doctorate">Doctorate</option>
			<option value="graduate">Graduate</option>
			<option value="nondegree">Non-degree</option>
		</select>
		<select
			class="px-4 py-1 text-sm rounded-md bg-white border-[1px]"
			value={year}
			on:change={paramsManager.onSelectInputChange('year')}
		>
			<option value="All">Filter by year...</option>
			<option value="2023">2023</option>
			<option value="2024">2024</option>
			<option value="2025">2025</option>
		</select>
		<select
			class="px-4 py-1 text-sm rounded-md bg-white border-[1px]"
			value={status}
			on:change={paramsManager.onSelectInputChange('status')}
		>
			<option value="All">Filter by status</option>
			<option value="pending">Pending</option>
			<option value="resolved">Resolved</option>
			<option value="accepted">Accepted</option>
			<option value="denied">Denied</option>
			<option value="neutral">Neutral</option>
		</select>
	</div>
	<div class="flex items-center gap-2">
		{#if cfer !== 'All'}
			<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('cfer')}
				>{cfer}</DismissibleBadge
			>
		{/if}
		{#if applicationType !== 'All'}
			<DismissibleBadge
				variant="secondary"
				onDismiss={paramsManager.onParamChange('applicationType')}
				>{applicationType}</DismissibleBadge
			>
		{/if}
		{#if year !== 'All'}
			<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('year')}
				>{year}</DismissibleBadge
			>
		{/if}
		{#if status !== 'All'}
			<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('status')}
				>{status}</DismissibleBadge
			>
		{/if}
	</div>
	{#await data.applications then applications}
		<div class="text-sm text-muted-foreground">{applications.length} records</div>
	{/await}
</section>

{#await data.applications}
	<LoadingSign />
{:then _}
	<div id="grid" class="data-grid full-page" bind:this={gridElement} />
{/await}
