<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	export let promisedData: Promise<any[]>;
	export let rowCount: number | null;
</script>

<div class="relative -top-3 -left-2 -z-10">
	{#await promisedData then data}
		{#if data.length && rowCount !== data.length}
			<Badge>{rowCount}/{data.length}</Badge>
		{:else if data.length}
			<Badge>{data.length}</Badge>
		{/if}
	{/await}
</div>
