<script lang="ts">
	import type { GridApi } from 'ag-grid-community';

	import * as Popover from '$lib/components/ui/popover';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import ListFilter from 'lucide-svelte/icons/list-filter';
	import ArrowDownToLine from 'lucide-svelte/icons/arrow-down-to-line';
	import Settings from 'lucide-svelte/icons/settings-2';

	import { timestamp } from '$lib/util/dateUtils';

	export let rowData: Promise<any[]>;
	export let gridApi: GridApi | null;
	export let baseFileName: string;
</script>

<div class="flex flex-wrap items-center justify-between gap-4 w-full">
	<div class="flex items-center gap-4">
		<Button
			variant="link"
			class="flex items-center gap-1 p-0 hover:no-underline hover:text-primary/80"
			><Settings class="size-4" />Columns</Button
		>

		<Popover.Root>
			<Popover.Trigger>
				<Button
					variant="link"
					class="flex items-center gap-1 p-0 hover:no-underline hover:text-primary/80"
				>
					<ListFilter class="size-4" />Filters
				</Button>
			</Popover.Trigger>
			<Popover.Content class="flex flex-col gap-4 translate-y-2">
				<slot name="filter-units" />
			</Popover.Content>
		</Popover.Root>

		<div class="flex flex-wrap items-center gap-1">
			<slot name="filter-badges" />
		</div>
	</div>

	{#await rowData then _}
		<div class="flex items-center gap-2">
			<Input class="w-[360px]" placeholder="Search..." />

			<Button
				variant="default"
				class="flex items-center gap-1 h-[40px]"
				on:click={() =>
					gridApi && gridApi.exportDataAsCsv({ fileName: `${baseFileName}_${timestamp()}` })}
				><ArrowDownToLine class="size-4" />Download</Button
			>
		</div>
	{/await}
</div>
