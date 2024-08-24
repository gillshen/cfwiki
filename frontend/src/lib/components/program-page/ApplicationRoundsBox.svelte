<script lang="ts">
	import { Table, TableBody, TableBodyRow, TableBodyCell } from 'flowbite-svelte';
	import { CalendarMonthOutline } from 'flowbite-svelte-icons';

	import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
	import ApplicationRoundPopover from '$lib/components/program-page/ApplicationRoundPopover.svelte';
	import { groupByYearTerm } from '$lib/utils/applicationRoundUtils';
	import { toShortDate } from '$lib/utils/dateUtils';

	export let applRounds: ApplicationRoundListItem[];
</script>

<Table divClass="mt-4">
	<TableBody>
		{#each Object.entries(groupByYearTerm(applRounds)) as [key, rounds]}
			<TableBodyRow>
				<TableBodyCell tdClass="font-medium pl-0 w-40 min-w-40 align-top py-4">
					{key}
				</TableBodyCell>

				<TableBodyCell tdClass="font-medium py-4 w-fit max-w-[80px] align-top">
					<div class="flex flex-col gap-3 w-fit">
						{#each rounds as applRound}
							<div class="text-primary-600 hover:underline cursor-pointer">{applRound.name}</div>
							<ApplicationRoundPopover {applRound} />
						{/each}
					</div>
				</TableBodyCell>

				<TableBodyCell tdClass="font-normal min-w-32 text-gray-500 py-4 align-top">
					<div class="flex flex-col gap-3">
						{#each rounds as applRound}
							<div class="flex items-center">
								<CalendarMonthOutline class="me-1 text-gray-400" />
								{toShortDate(applRound.due_date) || '?'}
							</div>
						{/each}
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
