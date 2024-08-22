<script lang="ts">
	import { Table, TableBody, TableBodyRow, TableBodyCell, A } from 'flowbite-svelte';

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

				<TableBodyCell tdClass="font-medium py-4 w-fit">
					<div class="flex flex-col gap-2 w-fit">
						{#each rounds as applRound}
							<A>{applRound.name}</A>
							<ApplicationRoundPopover {applRound} />
						{/each}
					</div>
				</TableBodyCell>

				<TableBodyCell tdClass="font-normal text-gray-500 py-4">
					<div class="flex flex-col gap-2">
						{#each rounds as applRound}
							<div>{toShortDate(applRound.due_date) || '-'}</div>
						{/each}
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
