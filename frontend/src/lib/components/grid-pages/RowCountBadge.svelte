<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	export let rows: Promise<any[]>;
	export let rowCount: number | null | undefined;
</script>

<div class="relative -top-3 -left-2 -z-10">
	{#await rows then rows}
		{#if rows.length && rowCount !== undefined && rowCount !== rows.length}
			<Badge>{rowCount}/{rows.length}</Badge>
		{:else if rows.length}
			<Badge>{rows.length}</Badge>
		{/if}
	{/await}
</div>
