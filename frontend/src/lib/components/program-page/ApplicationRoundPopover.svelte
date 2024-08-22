<script lang="ts">
	import { Popover, Heading, P, A } from 'flowbite-svelte';
	import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
	import { formatDueDateTime, toLongDate } from '$lib/utils/dateUtils';

	export let applRound: ApplicationRoundListItem;
</script>

<Popover class="w-[360px] p-2">
	<Heading tag="h3" class="text-lg font-medium">
		{applRound.program_iteration.term}
		{applRound.program_iteration.year} |
		{applRound.name}
	</Heading>

	<hr class="mt-2 mb-4" />

	<div>
		<P size="sm" weight="medium" class="mb-0.5">Due date</P>
		<P size="sm" weight="light">
			{formatDueDateTime(applRound.due_date, applRound.due_time, applRound.timezone) || 'N/A'}
		</P>
	</div>

	<div class="mt-4">
		<P size="sm" weight="medium" class="mb-0.5">Decision date</P>
		<P size="sm" weight="light">
			{toLongDate(applRound.decision_date) || 'N/A'}
		</P>
	</div>

	<div class="mt-8 flex gap-4">
		<A href={`/program/${applRound.program_iteration.program}/plan/${applRound.id}`}>Update</A>
		<A on:click={() => alert('delete')}>Delete</A>
	</div>
</Popover>
