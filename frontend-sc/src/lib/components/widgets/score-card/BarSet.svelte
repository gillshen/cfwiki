<script lang="ts">
	import type { ComponentType } from 'svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import Bar from './Bar.svelte';

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
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Bar {value} {maxValue} {damp}>
				<div class="flex flex-col justify-center">
					<svelte:component this={icon} class="size-3 mx-auto" />
					<p class="text-center">{value ?? '?'}</p>
				</div>
			</Bar>
		</Tooltip.Trigger>
		<Tooltip.Content>{label}: {value ?? '?'}</Tooltip.Content>
	</Tooltip.Root>
{/each}
