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
	import { applicationStatusCategories } from '$lib/api/applicationLog';
	import { SearchParamsManager } from '$lib/util/dataGridUtils';
	import { orderByUsername } from '$lib/util/userUtils';
	import { applicationTypes } from '$lib/api/application';
	import { activeYears } from '$lib/util/dateUtils';

	import {
		formatApplicationStatusCategory,
		formatApplicationType
	} from '$lib/util/applicationUtils';

	ModuleRegistry.registerModules([AllCommunityModule]);

	export let data;

	let gridApi: GridApi | null;
	let gridElement: HTMLElement;

	$: year = $page.url.searchParams.get('year') || 'All';
	$: applicationType = $page.url.searchParams.get('applicationType') || 'All';
	$: status = $page.url.searchParams.get('status') || 'All';
	$: cfer = $page.url.searchParams.get('cfer') || 'All';

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
			theme: themeQuartz,
			enableCellTextSelection: true
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
	<h1 class="data-grid-title">Applications</h1>

	<DataGridControl.Root rowData={data.applications} {gridApi} baseFileName="cf_applications">
		<svelte:fragment slot="filter-units">
			<DataGridControl.FilterUnit label="Year">
				<Select.Root
					selected={{ value: year, label: year }}
					onSelectedChange={paramsManager.onScSelectChange('year')}
				>
					<DataGridControl.FilterBody
						items={activeYears().map((year) => ({ value: year, label: year.toString() }))}
					/>
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="Type">
				<Select.Root
					selected={{ value: applicationType, label: formatApplicationType(applicationType) }}
					onSelectedChange={paramsManager.onScSelectChange('applicationType')}
				>
					<DataGridControl.FilterBody
						items={applicationTypes.map((t) => ({ value: t, label: t }))}
					/>
				</Select.Root>
			</DataGridControl.FilterUnit>

			<DataGridControl.FilterUnit label="Status">
				<Select.Root
					selected={{ value: status, label: formatApplicationStatusCategory(status) }}
					onSelectedChange={paramsManager.onScSelectChange('status')}
				>
					<DataGridControl.FilterBody
						items={applicationStatusCategories.map((c) => ({
							value: c,
							label: formatApplicationStatusCategory(c)
						}))}
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
		</svelte:fragment>
	</DataGridControl.Root>
</section>

{#await data.applications}
	<LoadingSign />
{:then applications}
	<div id="grid" class="data-grid full-page" bind:this={gridElement} />

	<RowCountLabel rowCount={applications.length} />
{/await}
