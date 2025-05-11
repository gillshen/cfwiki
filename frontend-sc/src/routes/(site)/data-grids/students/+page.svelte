<script lang="ts">
	import {
		ModuleRegistry,
		AllCommunityModule,
		createGrid,
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

	import {
		CONTRACT_TYPES,
		CONTRACT_STATUSES,
		type ContractType,
		type ContractStatus
	} from '$lib/api/contract';

	import {
		DEFAULT_COL_DEF,
		DEFAULT_GRID_OPTIONS,
		getActiveUsernames,
		SearchParamsManager
	} from '$lib/util/dataGridUtils';

	import { createTitle } from '$lib/util/siteUtils';
	import { activeYears } from '$lib/util/dateUtils';
	import { getColumnDefs } from '$lib/util/studentsGridColumns';

	ModuleRegistry.registerModules([AllCommunityModule]);

	export let data;

	let gridApi: GridApi | null;
	let gridElement: HTMLElement;
	let rowCount: number = 0;

	$: cfer = $page.url.searchParams.get('cfer') || 'All';

	$: contractType = ($page.url.searchParams.get('contractType') || 'All') as ContractType | 'All';

	$: targetYear = $page.url.searchParams.get('targetYear') || 'All';

	$: contractStatus = ($page.url.searchParams.get('contractStatus') || 'All') as
		| ContractStatus
		| 'All';

	$: columnDefs = getColumnDefs({ targetYear, contractType, contractStatus });

	const initGrid = async () => {
		gridElement = document.querySelector('#grid')!;
		const rowData = await data.students;
		const gridOptions: GridOptions = {
			defaultColDef: DEFAULT_COL_DEF,
			columnDefs,
			rowData,
			onFilterChanged: updateDisplayedRowCount,
			onModelUpdated: updateDisplayedRowCount,
			...DEFAULT_GRID_OPTIONS
		};
		gridApi = createGrid(gridElement, gridOptions);
	};

	const updateGrid = async () => {
		const rowData = await data.students;
		if (gridApi) {
			gridApi.setGridOption('rowData', rowData);
		}
	};

	const updateDisplayedRowCount = () => {
		if (gridApi) {
			rowCount = gridApi.getDisplayedRowCount();
		}
	};

	const paramsManager = new SearchParamsManager(page, updateGrid);

	afterNavigate(initGrid);
</script>

<svelte:head>
	<title>{createTitle('Students Data')}</title>
</svelte:head>

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
	<h1 class="data-grid-title flex items-center gap-4">
		Students
		<div class="flex items-center gap-1 pt-1">
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
		</div>
	</h1>

	<DataGridControl.Root rowData={data.students} {gridApi} baseFileName="cf_students">
		<div slot="filter-units" class="flex gap-6 pb-6">
			<DataGridControl.FilterUnit label="Target year">
				<Select.Root
					selected={{ value: targetYear, label: targetYear }}
					onSelectedChange={paramsManager.onScSelectChange('targetYear')}
				>
					<DataGridControl.FilterBody items={activeYears()} />
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="Contract type">
				<Select.Root
					selected={{ value: contractType, label: contractType }}
					onSelectedChange={paramsManager.onScSelectChange('contractType')}
				>
					<DataGridControl.FilterBody items={[...CONTRACT_TYPES]} />
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="Contract status">
				<Select.Root
					selected={{ value: contractStatus, label: contractStatus }}
					onSelectedChange={paramsManager.onScSelectChange('contractStatus')}
				>
					<DataGridControl.FilterBody items={[...CONTRACT_STATUSES]} />
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="CFer involved">
				<Select.Root
					selected={{ value: cfer, label: cfer }}
					onSelectedChange={paramsManager.onScSelectChange('cfer')}
				>
					<DataGridControl.FilterBody items={getActiveUsernames(data.cfUsers)} />
				</Select.Root>
			</DataGridControl.FilterUnit>
		</div>
	</DataGridControl.Root>
</section>

{#await data.students}
	<LoadingSign />
{:then _}
	<div id="grid" class="data-grid full-page" bind:this={gridElement} />

	<RowCountLabel {rowCount} singular="student" />
{/await}
