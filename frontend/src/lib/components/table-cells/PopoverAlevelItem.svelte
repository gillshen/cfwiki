<script lang="ts">
	import { compareAlevelGrade } from '$lib/utils/scoresUtils';
	import PopoverMultiContainer from '$lib/components/table-cells/PopoverMultiContainer.svelte';
	import ScoreCount from '$lib/components/table-cells/ScoreCount.svelte';

	export let items: Record<'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F', number>;
	export let label: string;
</script>

<PopoverMultiContainer {label}>
	{#each Object.entries(items).sort((a, b) => compareAlevelGrade(a[0], b[0])) as [score, count]}
		<ScoreCount {score} {count} />
	{/each}
</PopoverMultiContainer>
