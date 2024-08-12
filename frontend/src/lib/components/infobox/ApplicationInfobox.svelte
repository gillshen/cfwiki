<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import type { ApplicationDetail } from '$lib/api/application';
	import LinkWithIcon from '$lib/components/links/LinkWithIcon.svelte';
	import { formatDueDateTime, toLongDate } from '$lib/utils/dateUtils';

	export let application: ApplicationDetail;

	$: dueDateTime = formatDueDateTime(
		application.round.due_date,
		application.round.due_time,
		application.round.timezone
	);

	$: decisionDate = toLongDate(application.round.decision_date);
</script>

<Table>
	<TableBody>
		<TableBodyRow>
			<TableBodyCell tdClass="w-48 font-medium py-4">Term</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				{application.program_iteration.term}
				{application.program_iteration.year}
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-48 font-medium py-4">School</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				<div class="flex flex-col gap-2">
					{#each application.schools as school}
						<LinkWithIcon href={`/school/${school.id}`} text={school.name} />
					{/each}
				</div>
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-48 font-medium py-4">Program</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				<LinkWithIcon
					href={`/program/${application.program.id}`}
					text={application.program.display_name}
				/>
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-48 font-medium py-4">Appl. round</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{application.round.name}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-48 font-medium py-4">Due date</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{dueDateTime}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-48 font-medium py-4">Decision date</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{decisionDate}</TableBodyCell>
		</TableBodyRow>
	</TableBody>
</Table>
