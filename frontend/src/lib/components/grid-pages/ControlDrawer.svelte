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

<Drawer transitionType="fly" {transitionParams} bind:hidden={$hideControl} class="m-0 p-0">
	<div class="fixed top-0 left-0 w-[320px] h-[60px] pl-6 pr-2 shadow-sm z-50 flex items-center">
		<Heading tag="h3" class="text-base font-semibold">Show or Hide Columns</Heading>
		<CloseButton on:click={() => hideControl.set(true)} />
	</div>

	<div
		class="flex flex-col gap-3 translate-y-[60px] max-h-[calc(100vh-60px)] overflow-y-scroll pt-4 pb-6 px-6"
	>
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
