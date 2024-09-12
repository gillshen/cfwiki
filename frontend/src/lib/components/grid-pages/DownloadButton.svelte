<script lang="ts">
	import type { GridApi } from 'ag-grid-community';
	import { DownloadOutline } from 'flowbite-svelte-icons';

	import Button from '$lib/components/buttons/Button.svelte';

	export let gridApi: GridApi;
	export let fileName: string;

	const exportAsCsv = () => {
		gridApi.exportDataAsCsv({ fileName });
	};
</script>

<Button onClick={exportAsCsv} text="Download" icon={DownloadOutline} />
