<script lang="ts">
	import Rows from 'lucide-svelte/icons/rows-4';

	export let rowCount: number;
	export let singular: string = 'record';
	export let plural: string | undefined = undefined;
</script>

<div class="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
	<Rows class="size-4" />
	<span>{rowCount} {rowCount === 1 ? `${singular}` : `${plural ?? singular + 's'}`}</span>
</div>
