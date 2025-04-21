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

	import * as Select from '$lib/components/ui/select/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import * as DataGridControl from '$lib/components/widgets/data-grid-control/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import DismissibleBadge from '$lib/components/misc/DismissibleBadge.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import RowCountLabel from '$lib/components/misc/RowCountLabel.svelte';
	import { contractStatuses, contractTypes } from '$lib/api/contract';
	import { SearchParamsManager } from '$lib/util/dataGridUtils';
	import { orderByUsername } from '$lib/util/userUtils';
	import { activeYears } from '$lib/util/dateUtils';

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

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/data-grids/index">Data Grids</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>Students</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="pb-2 flex flex-col gap-2">
	<h1 class="data-grid-title">Students</h1>

	<DataGridControl.Root rowData={data.students} {gridApi} baseFileName="cf_students">
		<svelte:fragment slot="filter-units">
			<DataGridControl.FilterUnit label="Target year">
				<Select.Root
					selected={{ value: targetYear, label: targetYear }}
					onSelectedChange={paramsManager.onScSelectChange('targetYear')}
				>
					<DataGridControl.FilterBody
						items={activeYears().map((year) => ({ value: year, label: year.toString() }))}
					/>
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="Contract type">
				<Select.Root
					selected={{ value: contractType, label: contractType }}
					onSelectedChange={paramsManager.onScSelectChange('contractType')}
				>
					<DataGridControl.FilterBody items={contractTypes.map((t) => ({ value: t, label: t }))} />
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="Contract status">
				<Select.Root
					selected={{ value: contractStatus, label: contractStatus }}
					onSelectedChange={paramsManager.onScSelectChange('contractStatus')}
				>
					<DataGridControl.FilterBody
						items={contractStatuses.map((t) => ({ value: t, label: t }))}
					/>
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="CFer">
				<Select.Root
					selected={{ value: cfer, label: cfer }}
					onSelectedChange={paramsManager.onScSelectChange('cfer')}
				>
					<DataGridControl.FilterBody
						items={data.cfUsers
							.filter((u) => u.is_active)
							.sort(orderByUsername)
							.map((cfer) => ({ value: cfer.username, label: cfer.username }))}
					/>
				</Select.Root>
			</DataGridControl.FilterUnit>
		</svelte:fragment>

		<svelte:fragment slot="filter-badges">
			{#if cfer !== 'All'}
				<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('cfer')}
					>{cfer}</DismissibleBadge
				>
			{/if}
			{#if contractType !== 'All'}
				<DismissibleBadge
					variant="secondary"
					onDismiss={paramsManager.onParamChange('contractType')}>{contractType}</DismissibleBadge
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
		</svelte:fragment>
	</DataGridControl.Root>
</section>

{#await data.students}
	<LoadingSign />
{:then students}
	<div id="grid" class="data-grid full-page" bind:this={gridElement} />

	<RowCountLabel rowCount={students.length} />
{/await}
