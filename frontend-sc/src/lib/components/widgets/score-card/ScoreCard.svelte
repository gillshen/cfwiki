<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import { toShortDate } from '$lib/util/dateUtils';

	export let testName: string;
	export let scoreValue: number | string | null | undefined;
	export let testDate: string | null | undefined;
</script>

<Card.Root class="w-fit min-w-[200px]">
	<Card.Content class="w-full flex items-top gap-4 justify-between space-between">
		<div class="text-left">
			<div class="font-bold">{testName}</div>
			<p class="text-xs text-muted-foreground">{toShortDate(testDate) || 'Date N/A'}</p>
		</div>
		{#if scoreValue !== null && scoreValue !== undefined}
			<p class="text-3xl font-semibold -mt-[2px]">{scoreValue}</p>
		{/if}
	</Card.Content>
	<Card.Footer class="flex flex-col mb-auto">
		<slot />
		<slot name="additional" />
	</Card.Footer>
</Card.Root>
