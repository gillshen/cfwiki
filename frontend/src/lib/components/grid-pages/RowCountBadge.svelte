<script lang="ts">
	import { DatabaseOutline } from 'flowbite-svelte-icons';

	export let rows: any[];
	export let rowCount: number | null | undefined;

	$: total = `${rows.length} record${rows.length === 1 ? '' : 's'}`;
	$: displayed = typeof rowCount === 'number' && rowCount !== rows.length ? `${rowCount} of ` : '';
</script>

<div class="text-xs font-normal text-gray-500 flex">
	<DatabaseOutline class="size-4 me-1" /><span>{displayed}{total}</span>
</div>
