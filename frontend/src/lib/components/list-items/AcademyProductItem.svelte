<script lang="ts">
	import { splitAtChineseRuns } from '$lib/utils/stringUtils';

	export let product: { name: string };
	export let spanClass: string = '';
	export let gap: string = 'gap-0.5';
</script>

<span class={`flex ${gap}`}>
	{#each splitAtChineseRuns(product.name) as run}
		<span class={spanClass}>{run}</span>
	{/each}
</span>
