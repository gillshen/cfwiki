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
	import { APPLICATION_TYPES, type ApplicationType } from '$lib/api/application';

	import {
		APPLICATION_STATUS_CATEGORIES,
		type ApplicationStatusCategory
	} from '$lib/api/applicationLog';

	import {
		DEFAULT_COL_DEF,
		DEFAULT_GRID_OPTIONS,
		getActiveUsernames,
		SearchParamsManager
	} from '$lib/util/dataGridUtils';

	import {
		formatApplicationStatusCategory,
		formatApplicationType
	} from '$lib/util/applicationUtils';

	import { createTitle } from '$lib/util/siteUtils';
	import { activeYears } from '$lib/util/dateUtils';
	import { getColumnDefs } from '$lib/util/applicationsGridColumns';

	ModuleRegistry.registerModules([AllCommunityModule]);

	export let data;

	let gridApi: GridApi | null;
	let gridElement: HTMLElement;
	let rowCount: number = 0;

	$: cfer = $page.url.searchParams.get('cfer') || 'All';
	$: year = $page.url.searchParams.get('year') || 'All';

	$: applicationType = ($page.url.searchParams.get('applicationType') || 'All') as
		| ApplicationType
		| 'All';

	$: status = ($page.url.searchParams.get('status') || 'All') as ApplicationStatusCategory | 'All';

	$: columnDefs = getColumnDefs({ year, applicationType, status });

	const initGrid = async () => {
		gridElement = document.querySelector('#grid')!;
		const rowData = await data.applications;
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
		const rowData = await data.applications;
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
	<title>{createTitle('Applications Data')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/data-grids/index">Data Grids</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>Applications</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="pb-2 flex flex-col gap-2">
	<h1 class="data-grid-title flex items-center gap-4">
		Applications
		<div class="flex items-center gap-1 pt-1">
			{#if year !== 'All'}
				<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('year')}
					>{year}</DismissibleBadge
				>
			{/if}
			{#if applicationType !== 'All'}
				<DismissibleBadge
					variant="secondary"
					onDismiss={paramsManager.onParamChange('applicationType')}
					>{formatApplicationType(applicationType)}</DismissibleBadge
				>
			{/if}
			{#if status !== 'All'}
				<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('status')}
					>{formatApplicationStatusCategory(status)}</DismissibleBadge
				>
			{/if}
			{#if cfer !== 'All'}
				<DismissibleBadge variant="secondary" onDismiss={paramsManager.onParamChange('cfer')}
					>{cfer}</DismissibleBadge
				>
			{/if}
		</div>
	</h1>

	<DataGridControl.Root rowData={data.applications} {gridApi} baseFileName="cf_applications">
		<div slot="filter-units" class="flex gap-6">
			<DataGridControl.FilterUnit label="Year">
				<Select.Root
					selected={{ value: year, label: year }}
					onSelectedChange={paramsManager.onScSelectChange('year')}
				>
					<DataGridControl.FilterBody items={activeYears()} />
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="Type">
				<Select.Root
					selected={{ value: applicationType, label: formatApplicationType(applicationType) }}
					onSelectedChange={paramsManager.onScSelectChange('applicationType')}
				>
					<DataGridControl.FilterBody
						items={APPLICATION_TYPES.map((t) => ({ value: t, label: formatApplicationType(t) }))}
					/>
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="Status">
				<Select.Root
					selected={{ value: status, label: formatApplicationStatusCategory(status) }}
					onSelectedChange={paramsManager.onScSelectChange('status')}
				>
					<DataGridControl.FilterBody
						items={APPLICATION_STATUS_CATEGORIES.map((c) => ({
							value: c,
							label: formatApplicationStatusCategory(c)
						}))}
					/>
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

{#await data.applications}
	<LoadingSign />
{:then _}
	<div id="grid" class="data-grid full-page" bind:this={gridElement} />

	<RowCountLabel {rowCount} singular="application" />
{/await}
