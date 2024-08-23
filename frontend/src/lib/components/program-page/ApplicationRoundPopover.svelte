<script lang="ts">
	import { Popover, Heading, P, A } from 'flowbite-svelte';

	import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
	import { formatDueDateTime, toLongDate } from '$lib/utils/dateUtils';

	export let applRound: ApplicationRoundListItem;

	const { id, program_iteration, name, due_date, due_time, timezone, decision_date } = applRound;
	const { program, year, term } = program_iteration;
</script>

<Popover class="w-[360px]" defaultClass="p-0 m-0">
	<Heading tag="h3" class="text-lg font-medium bg-stone-100 px-6 py-2">
		{`${term} ${year} | ${name}`}
	</Heading>

	<div class="px-6 py-4">
		<div>
			<P size="sm" weight="medium" class="mb-0.5">Due date</P>
			<P size="sm" weight="light">{formatDueDateTime(due_date, due_time, timezone) || 'N/A'}</P>
		</div>

		<div class="mt-4">
			<P size="sm" weight="medium" class="mb-0.5">Decision date</P>
			<P size="sm" weight="light">{toLongDate(decision_date) || 'N/A'}</P>
		</div>

		<div class="mt-8 flex gap-4">
			<A href={`/program/${program}/plan/${id}`}>Update</A>
			<A on:click={() => alert('delete')}>Delete</A>
		</div>
	</div>
</Popover>
