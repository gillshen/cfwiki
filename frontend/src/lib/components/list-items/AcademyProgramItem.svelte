<script lang="ts">
	import { splitAtChineseRuns } from '$lib/utils/stringUtils';

	export let program: { name: string };
	export let spanClass: string = '';
	export let gap: string = 'gap-0.5';
</script>

<span class={`flex ${gap}`}>
	{#each splitAtChineseRuns(program.name) as run}
		<span class={spanClass}>{run}</span>
	{/each}
</span>
