<script lang="ts">
	import type { ComponentType } from 'svelte';
	import Bar from './Bar.svelte';
	import Tooltip from '$lib/components/containers/Tooltip.svelte';

	type SubScore = {
		label: string;
		value: number | null | undefined;
		maxValue: number;
		icon: ComponentType;
	};

	export let subScores: SubScore[];
	export let damp: number = 1.7;
</script>

{#each subScores as { label, value, maxValue, icon }}
	<Tooltip text="{label}: {value ?? '?'}">
		<Bar {value} {maxValue} {damp}>
			<div class="flex flex-col justify-center">
				<svelte:component this={icon} class="size-3 mx-auto" />
				<p class="text-center">{value ?? '?'}</p>
			</div>
		</Bar>
	</Tooltip>
{/each}
