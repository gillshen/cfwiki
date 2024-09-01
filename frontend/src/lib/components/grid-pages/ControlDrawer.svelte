<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { GridApi } from 'ag-grid-community';
	import { sineIn } from 'svelte/easing';
	import { Heading, Drawer, CloseButton, Checkbox } from 'flowbite-svelte';

	import { showColumn } from '$lib/utils/gridUtils';

	export let gridApi: GridApi;
	export let columnVisibility: Record<string, boolean>;
	export let hideControl: Writable<boolean>;

	const transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={$hideControl}>
	<div class="flex items-center pl-2">
		<Heading tag="h3" class="text-lg font-semibold">Show or Hide Columns</Heading>
		<CloseButton on:click={() => hideControl.set(true)} />
	</div>

	<div class="flex flex-col gap-3 my-6 pl-2 pr-4">
		{#each Object.keys(columnVisibility) as headerName}
			<Checkbox
				bind:checked={columnVisibility[headerName]}
				on:change={() => showColumn(gridApi, headerName, columnVisibility[headerName])}
			>
				{headerName}
			</Checkbox>
		{/each}
	</div>
</Drawer>
