<script lang="ts">
	import type { GridApi } from 'ag-grid-community';

	import * as Popover from '$lib/components/ui/popover';
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
		<Popover.Root>
			<Popover.Trigger>
				<Button
					variant="link"
					class="flex items-center gap-1 p-0 hover:no-underline hover:text-primary/80"
					><Settings class="size-4" />Columns</Button
				>
			</Popover.Trigger>
			<Popover.Content class="p-0 flex flex-col gap-4 translate-x-9 w-fit min-w-[300px]">
				<h2 class="px-6 pt-4 text-base font-semibold flex items-center gap-2">
					<Settings class="size-4" />Choose columns to display
				</h2>

				<div
					class="px-6 pb-6 grid grid-cols-4 gap-y-2 gap-x-4 max-h-[calc(100vh-288px)] overflow-auto"
				>
					{#each gridApi?.getColumns() ?? [] as column, index}
						{@const headerName = column.getColDef().headerName || 'ID'}
						<div class="flex items-center space-x-2">
							<Checkbox
								id={`checkbox-${index}`}
								aria-labelledby={`checkbox-${index}-label`}
								checked={column.isVisible()}
								on:click={() => {
									gridApi?.setColumnsVisible([column], !column.isVisible());
								}}
							/>
							<Label
								id={`checkbox-${index}-label`}
								for={`checkbox-${index}`}
								class="text-sm font-normal">{headerName}</Label
							>
						</div>
					{/each}
				</div>
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				<Button
					variant="link"
					class="flex items-center gap-1 p-0 hover:no-underline hover:text-primary/80"
				>
					<ListFilter class="size-4" />Quick Filters
				</Button>
			</Popover.Trigger>
			<Popover.Content class="p-0 flex flex-col gap-4 w-fit min-w-[300px]">
				<h2 class="px-6 pt-4 text-base font-semibold flex items-center gap-2">
					<ListFilter class="size-4" />Filter by
				</h2>
				<div class="px-6 pb-6 max-h-[calc(100vh-288px)] overflow-auto">
					<slot name="filter-units" />
				</div>
			</Popover.Content>
		</Popover.Root>

		<div class="flex flex-wrap items-center gap-1">
			<slot name="filter-badges" />
		</div>
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
