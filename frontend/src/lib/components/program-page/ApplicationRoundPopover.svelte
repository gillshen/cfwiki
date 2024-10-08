<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Popover, Heading, P, Tooltip } from 'flowbite-svelte';
	import { PenOutline } from 'flowbite-svelte-icons';

	import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
	import { formatDueDateTime, toLongDate } from '$lib/utils/dateUtils';
	import DeleteButton from '$lib/components/buttons/DeleteButton.svelte';
	import GotoButton from '$lib/components/buttons/GotoButton.svelte';

	export let applRound: ApplicationRoundListItem;
	export let onDelete: () => void = () => {};

	const {
		id,
		program_iteration,
		name,
		due_date,
		due_time,
		timezone,
		decision_date,
		applications_count
	} = applRound;

	const { program, year, term } = program_iteration;
</script>

<Popover class="w-[360px]" defaultClass="p-0 m-0" transition={fade} params={{ duration: 200 }}>
	<Heading tag="h3" class="text-lg font-medium bg-stone-100 px-6 py-2">
		{`${term} ${year} | ${name}`}
	</Heading>

	<div class="px-6 py-4 text-sm">
		<div>
			<P size="sm" weight="medium" class="mb-0.5">Due date</P>
			<P size="sm" weight="light">{formatDueDateTime(due_date, due_time, timezone) || 'N/A'}</P>
		</div>

		<div class="mt-4">
			<P size="sm" weight="medium" class="mb-0.5">Decision date</P>
			<P size="sm" weight="light">{toLongDate(decision_date) || 'N/A'}</P>
		</div>

		<div class="mt-8 flex gap-4 items-baseline">
			<GotoButton href={`/program/${program}/plan/${id}`} text="Update" icon={PenOutline} />
			<DeleteButton onClick={onDelete} disabled={!!applications_count} />
			{#if applications_count}
				<Tooltip class="tooltip" placement="right-end">
					You cannot delete this admission plan because it has applications attached it.
				</Tooltip>
			{/if}
		</div>
	</div>
</Popover>
