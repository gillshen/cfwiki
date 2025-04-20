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
	import { orderByUsername } from '$lib/util/userUtils';

	ModuleRegistry.registerModules([AllCommunityModule]);

	export let data;

	let gridApi: GridApi | null;
	let gridElement: HTMLElement;

	$: cfer = $page.url.searchParams.get('cfer') || 'All';
	$: contractType = $page.url.searchParams.get('contractType') || 'All';
	$: targetYear = $page.url.searchParams.get('targetYear') || 'All';
	$: contractStatus = $page.url.searchParams.get('contractStatus') || 'All';

	const initGrid = async () => {
		gridElement = document.querySelector('#grid')!;
		const students = await data.students;
		const gridOptions: GridOptions = {
			defaultColDef: {
				filter: true,
				flex: 1,
				minWidth: 100
			},
			columnDefs,
			rowData: students,
			theme: themeQuartz
		};
		gridApi = createGrid(gridElement, gridOptions);
	};

	const updateGrid = async () => {
		const students = await data.students;
		if (gridApi) {
			gridApi.setGridOption('rowData', students);
		}
	};

	const paramsManager = new SearchParamsManager(page, updateGrid);

	const columnDefs = [
		{ field: 'id' },
		{ field: 'fullname' },
		{ field: 'preferred_name' },
		{ field: 'gender' },
		{ field: 'citizenship' },
		{ field: 'date_of_birth' },
		{ field: 'base_country' },
		{ field: 'base_city' }
	];

	afterNavigate(initGrid);
</script>

<section class="py-3 flex items-center gap-4">
	<h1 class="data-grid-title">Students</h1>
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
			value={contractType}
			on:change={paramsManager.onSelectInputChange('contractType')}
		>
			<option value="All">Filter by contract...</option>
			<option value="UG Freshman">UG Freshman</option>
			<option value="UG Transfer">UG Transfer</option>
			<option value="Graduate">Graduate</option>
			<option value="Other">Other</option>
		</select>
		<select
			class="px-4 py-1 text-sm rounded-md bg-white border-[1px]"
			value={targetYear}
			on:change={paramsManager.onSelectInputChange('targetYear')}
		>
			<option value="All">Filter by year...</option>
			<option value="2023">2023</option>
			<option value="2024">2024</option>
			<option value="2025">2025</option>
		</select>
		<select
			class="px-4 py-1 text-sm rounded-md bg-white border-[1px]"
			value={contractStatus}
			on:change={paramsManager.onSelectInputChange('contractStatus')}
		>
			<option value="All">Filter by status</option>
			<option value="In effect">In effect</option>
			<option value="Fulfilled">Fulfilled</option>
			<option value="Terminated">Terminated</option>
		</select>
	</div>
	<div class="flex items-center gap-2">
		{#if cfer !== 'All'}
			<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('cfer')}
				>{cfer}</DismissibleBadge
			>
		{/if}
		{#if contractType !== 'All'}
			<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('contractType')}
				>{contractType}</DismissibleBadge
			>
		{/if}
		{#if targetYear !== 'All'}
			<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('targetYear')}
				>{targetYear}</DismissibleBadge
			>
		{/if}
		{#if contractStatus !== 'All'}
			<DismissibleBadge
				variant="secondary"
				onDismiss={paramsManager.onParamChange('contractStatus')}
				>Contract: {contractStatus}</DismissibleBadge
			>
		{/if}
	</div>
	{#await data.students then students}
		<div class="text-sm text-muted-foreground">{students.length} records</div>
	{/await}
</section>

{#await data.students}
	<LoadingSign />
{:then _}
	<div id="grid" class="data-grid full-page" bind:this={gridElement} />
{/await}
