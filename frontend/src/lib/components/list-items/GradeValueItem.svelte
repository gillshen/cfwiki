<script lang="ts">
	import { formatGradeValue } from '$lib/utils/gradesUtils';

	export let value: number | string;
	export let scale: number | string;

	$: notNumeric = parseFloat(scale as string) === 0;
</script>

<span class="flex gap-[.1rem] tabular-nums">
	{#if notNumeric}
		<span class="font-normal text-gray-400">Not numeric</span>
	{:else}
		<span class="font-medium">{formatGradeValue(value, scale)}</span>
		<span class="text-gray-400 font-normal">/</span>
		<span class="text-gray-400 font-normal">{formatGradeValue(scale)}</span>
	{/if}
</span>
