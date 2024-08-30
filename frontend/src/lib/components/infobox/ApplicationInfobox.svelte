<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import type { ApplicationDetail } from '$lib/api/application';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import Comments from '$lib/components/typography/Comments.svelte';
	import { formatDueDateTime, toLongDate } from '$lib/utils/dateUtils';

	export let application: ApplicationDetail;

	const placeHolder = '-';

	$: dueDateTime = formatDueDateTime(
		application.round.due_date,
		application.round.due_time,
		application.round.timezone
	);

	$: decisionDate = toLongDate(application.round.decision_date);

	$: majors = [application.major_1, application.major_2, application.major_3].filter(Boolean);
</script>

<Table>
	<TableBody>
		<TableBodyRow>
			<TableBodyCell tdClass="w-40  min-w-32 font-medium py-4">Term</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				{application.program_iteration.term}
				{application.program_iteration.year}
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4 align-top">School</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4 truncate">
				<div class="flex flex-col gap-2 truncate">
					{#each application.schools as school}
						<LinkWithIcon href={`/school/${school.id}`} text={school.name} />
					{/each}
				</div>
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4 align-top">Program</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				<LinkWithIcon
					href={`/program/${application.program.id}`}
					text={application.program.display_name}
				/>
			</TableBodyCell>
		</TableBodyRow>

		{#if majors.length}
			<TableBodyRow>
				<TableBodyCell tdClass="w-40 font-medium py-4 align-top">
					{majors.length > 1 ? 'Majors' : 'Major'}
				</TableBodyCell>
				<TableBodyCell tdClass="font-normal py-4 truncate">
					<div class="flex flex-col gap-2 truncate">
						{#each majors as major}
							<div class="truncate">{major}</div>
						{/each}
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{/if}

		{#if application.track}
			<TableBodyRow>
				<TableBodyCell tdClass="w-40 font-medium py-4 align-top">Track</TableBodyCell>
				<TableBodyCell tdClass="font-normal py-4 truncate">{application.track}</TableBodyCell>
			</TableBodyRow>
		{/if}

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Adm. plan</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{application.round.name}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Due date</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{dueDateTime || placeHolder}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Decision date</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{decisionDate || placeHolder}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4 align-top">Comments</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				{#if application.comments}
					<Comments text={application.comments} divClass="pr-4" />
				{:else}
					{placeHolder}
				{/if}
			</TableBodyCell>
		</TableBodyRow>
	</TableBody>
</Table>
