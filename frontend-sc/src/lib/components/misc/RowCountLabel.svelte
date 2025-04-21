<script lang="ts">
	import Rows from 'lucide-svelte/icons/rows-4';
	export let rowCount: number;
</script>

<div class="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
	<Rows class="size-4" />
	{rowCount} record{rowCount === 1 ? '' : 's'}
</div>
