<script lang="ts">
	export let rowCount: number;
	export let singular: string = 'row';
	export let plural: string | undefined = undefined;
</script>

<div class="text-xs text-muted-foreground mt-2 px-2">
	{rowCount}
	{rowCount === 1 ? `${singular}` : `${plural ?? singular + 's'}`}
</div>
