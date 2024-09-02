<script lang="ts">
	import type { AlevelCount } from '$lib/api/student';
	import { compareAlevelGrade } from '$lib/utils/scoresUtils';
	import PopoverMultiContainer from '$lib/components/table-cells/PopoverMultiContainer.svelte';
	import ScoreCount from '$lib/components/table-cells/ScoreCount.svelte';

	export let items: AlevelCount[];
	export let type: 'predicted' | 'final';

	$: filtered = items.filter((i) => i.type === type);
</script>

{#if filtered.length}
	<PopoverMultiContainer label={`A-level ${type === 'predicted' ? 'pred.' : 'final'}`}>
		{#each filtered.sort((a, b) => compareAlevelGrade(a.grade, b.grade)) as item}
			<ScoreCount score={item.grade} count={item.count} />
		{/each}
	</PopoverMultiContainer>
{/if}
