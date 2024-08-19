<script lang="ts">
	import {
		Button,
		Table,
		TableBody,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';

	import type { StudentDetail } from '$lib/api/student';
	import type { ApplicationListItem } from '$lib/api/application';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import Schools from '$lib/components/table-cells/Schools.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import PlainCell from '$lib/components/table-cells/PlainCell.svelte';

	import {
		orderByDueDate,
		orderBySchoolName,
		orderByStatus,
		orderByYearDesc
	} from '$lib/utils/applicationUtils';

	export let student: StudentDetail;
	export let applications: Promise<ApplicationListItem[]>;
	export let canEdit: boolean = false;
</script>

<article class="mt-24 col-span-2">
	<ApplicationsLoader {applications}>
		<svelte:fragment let:applications>
			<Table class="mt-8" hoverable={applications.length > 1}>
				<TableHead>
					<TableHeadCell></TableHeadCell>
					<TableHeadCell>Year</TableHeadCell>
					<TableHeadCell>Type</TableHeadCell>
					<TableHeadCell>School</TableHeadCell>
					<TableHeadCell>Program/Major</TableHeadCell>
					<TableHeadCell>Round</TableHeadCell>
					<TableHeadCell>Due</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
				</TableHead>

				<TableBody>
					{#each applications
						.sort(orderBySchoolName)
						.sort(orderByDueDate)
						.sort(orderByStatus)
						.sort(orderByYearDesc) as appl}
						<TableBodyRow>
							<ApplicationLink application={appl} />
							<PlainCell text={appl.program_iteration.year} />
							<PlainCell text={appl.program.type} />
							<Schools application={appl} maxWidth="14rem" />
							<ProgramOrMajors application={appl} maxWidth="12rem" />
							<ApplicationRound application={appl} />
							<ShortDate date={appl.round.due_date} />
							<ApplicationStatus application={appl} />
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</svelte:fragment>
	</ApplicationsLoader>

	{#if canEdit && student.contracts_sorted.length}
		<Button outline href={`/student/${student.id}/new-application`} class="mt-8">
			Create an application
		</Button>
	{:else if canEdit}
		<Button outline disabled class="mt-8">Create an application</Button>
		<Tooltip class="w-96 font-normal">
			Applications must be attached to an existing contract. Create a contract first to enable this
			option.
		</Tooltip>
	{/if}
</article>
