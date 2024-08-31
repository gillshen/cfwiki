<script lang="ts">
	import type { GridApi } from 'ag-grid-community';
	import { Button } from 'flowbite-svelte';
	import { DownloadOutline } from 'flowbite-svelte-icons';

	export let gridApi: GridApi;
	export let fileName: string;

	const exportAsCsv = () => {
		gridApi.exportDataAsCsv({ fileName });
	};
</script>

<Button outline class="!py-2" on:click={exportAsCsv}>
	<DownloadOutline class="me-2" />Download
</Button>
