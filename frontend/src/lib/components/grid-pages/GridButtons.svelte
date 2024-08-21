<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { DownloadOutline, CogOutline } from 'flowbite-svelte-icons';

	export let onDownload: () => void;
	export let onConfig: () => void;
</script>

<div class="flex gap-4 items-center">
	<Button outline class="!py-2" on:click={onDownload}>
		<DownloadOutline class="me-2" />Download
	</Button>

	<Button outline class="!p-2" on:click={onConfig}>
		<CogOutline size="md" />
	</Button>
</div>
