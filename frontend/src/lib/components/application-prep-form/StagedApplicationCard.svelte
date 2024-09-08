<script lang="ts">
	import { Card, CloseButton } from 'flowbite-svelte';

	import type { StagedApplication } from '$lib/schemas/application';
	import type { StagedProgram } from '$lib/schemas/programCollection';
	import { enhanceDisplayName, formatSchoolNames } from '$lib/utils/programUtils';
	import { formatRound } from '$lib/utils/applicationRoundUtils';

	export let item: StagedApplication | StagedProgram;
	export let onRemove: () => void = () => {};
</script>

<Card padding="md" size="lg">
	<div class="flex justify-between w-full">
		<div class="flex flex-col gap-1 text-sm">
			<span class="font-medium">{formatSchoolNames(item.program)}</span>
			<span>{enhanceDisplayName(item.program)}</span>

			{#if 'round' in item}
				<div class="text-sm text-primary-500">{formatRound(item.round)}</div>
			{/if}
		</div>

		<div class="-mt-2">
			<CloseButton on:click={onRemove} />
		</div>
	</div>
</Card>
