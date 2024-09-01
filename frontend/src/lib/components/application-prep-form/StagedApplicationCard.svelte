<script lang="ts">
	import { Card, CloseButton } from 'flowbite-svelte';

	import type { StagedApplication } from '$lib/schemas/application';
	import { enhanceDisplayName } from '$lib/utils/programUtils';
	import { formatRound } from '$lib/utils/applicationRoundUtils';

	export let item: StagedApplication;
	export let onRemove: () => void = () => {};

	const { school, program, round } = item;
</script>

<Card padding="md" size="lg">
	<div class="flex justify-between w-full">
		<div class="flex flex-col gap-1 text-sm">
			<span class="font-medium">{school.name}</span>
			<span>{enhanceDisplayName(program)}</span>
			<div class="text-sm text-primary-500">{formatRound(round)}</div>
		</div>

		<div class="-mt-2">
			<CloseButton on:click={onRemove} />
		</div>
	</div>
</Card>
