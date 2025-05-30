<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Grade } from '$lib/api/grade';
	import { removeTrailingZeros } from '$lib/util/gradeUtils';

	export let grade: Grade;
	export let className: string = '';
	export { className as class };
</script>

<div class={cn('inline-flex tabular-nums w-full', className)}>
	{#if grade.comments}
		{grade.comments}
	{:else}
		<span>{removeTrailingZeros(grade.value)}</span>
		<span class="text-muted-foreground/50"
			>&ThinSpace;/&ThinSpace;{removeTrailingZeros(grade.scale)}</span
		>
	{/if}
</div>
