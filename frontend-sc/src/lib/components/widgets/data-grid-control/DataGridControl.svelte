<script lang="ts">
	import type { GridApi } from 'ag-grid-community';

	import * as Sheet from '$lib/components/ui/sheet/index';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import ListFilter from 'lucide-svelte/icons/list-filter';
	import ChartColumn from 'lucide-svelte/icons/chart-column';
	import ArrowDownToLine from 'lucide-svelte/icons/arrow-down-to-line';
	import Settings from 'lucide-svelte/icons/settings-2';

	import { timestamp } from '$lib/util/dateUtils';

	export let rowData: Promise<any[]>;
	export let gridApi: GridApi | null;
	export let baseFileName: string;

	let filterText: string = '';

	const onFilterTextBoxChanged = () => {
		if (gridApi) {
			console.log('onFilterTextBoxChanged', filterText);
			gridApi!.setGridOption('quickFilterText', filterText);
		}
	};
</script>

<div class="flex flex-wrap items-center justify-between gap-4 w-full">
	<div class="flex items-center gap-4 flex-grow-1">
		<Sheet.Root>
			<Sheet.Trigger>
				<Button
					variant="link"
					class="flex items-center gap-1 p-0 hover:no-underline hover:text-primary/80"
					><Settings class="size-4" />Columns</Button
				>
			</Sheet.Trigger>
			<Sheet.Content side="bottom" class="max-h-[70vh] min-h-[50vh] overflow-auto">
				<div class="w-fit mx-auto">
					<Sheet.Header>
						<Sheet.Title class="flex items-center gap-2">
							<Settings class="size-4" />Choose columns to display
						</Sheet.Title>
					</Sheet.Header>
					<div class="pt-6 w-fit grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-2 gap-x-6">
						{#each gridApi?.getColumns() ?? [] as column, i}
							{@const headerName = column.getColDef().headerName || 'ID'}
							<div class="flex items-center space-x-2">
								<Checkbox
									id="checkbox-{i}"
									aria-labelledby="checkbox-{i}-label"
									checked={column.isVisible()}
									on:click={() => {
										gridApi?.setColumnsVisible([column], !column.isVisible());
									}}
								/>
								<Label id="checkbox-{i}-label" for="checkbox-{i}" class="text-sm font-normal"
									>{headerName}</Label
								>
							</div>
						{/each}
					</div>
				</div>
			</Sheet.Content>
		</Sheet.Root>

		<Sheet.Root>
			<Sheet.Trigger>
				<Button
					variant="link"
					class="flex items-center gap-1 p-0 hover:no-underline hover:text-primary/80"
				>
					<ListFilter class="size-4" />Primary Filters
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="bottom" class="max-h-[70vh] min-h-[50vh] overflow-auto">
				<div class="w-fit mx-auto">
					<Sheet.Header>
						<Sheet.Title class="flex items-center gap-2">
							<ListFilter class="size-4" />Primary Filters
						</Sheet.Title>
					</Sheet.Header>
					<div class="pt-6">
						<slot name="filter-units" />
					</div>
				</div>
			</Sheet.Content>
		</Sheet.Root>
	</div>

	{#await rowData then _}
		<div class="flex items-center gap-2">
			<Input
				class="w-[300px]"
				placeholder="Search..."
				bind:value={filterText}
				on:input={onFilterTextBoxChanged}
			/>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant="outline"
						size="icon"
						class="flex items-center gap-1 w-[40px] h-[40px]"
						on:click={() => alert('TODO: stats')}
					>
						<ChartColumn class="size-4" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Statistics</p>
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant="outline"
						size="icon"
						class="flex items-center gap-1 w-[40px] h-[40px]"
						on:click={() =>
							gridApi && gridApi.exportDataAsCsv({ fileName: `${baseFileName}_${timestamp()}` })}
						><ArrowDownToLine class="size-4" /></Button
					>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Download</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/await}
</div>
