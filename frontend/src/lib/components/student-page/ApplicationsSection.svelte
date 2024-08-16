<script lang="ts">
	import {
		Button,
		A,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';

	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';

	import {
		type ApplicationListItem,
		orderByDueDate,
		orderBySchoolName,
		orderByStatus,
		orderByYearDesc,
		formatMajors
	} from '$lib/api/application';

	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import { toShortDate } from '$lib/utils/dateUtils';
	import { isUndergraduate } from '$lib/api/program';

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
							<TableBodyCell class="w-4 pl-2">
								<A href={`/application/${appl.id}`}><ArrowUpRightFromSquareOutline /></A>
							</TableBodyCell>
							<TableBodyCell class="font-normal">{appl.program_iteration.year}</TableBodyCell>
							<TableBodyCell class="font-normal">{appl.program.type}</TableBodyCell>
							<TableBodyCell class="w-fit max-w-56 truncate">
								{appl.schools.map((s) => s.name).join(' + ')}
							</TableBodyCell>

							<TableBodyCell class="font-normal max-w-48 truncate">
								{#if isUndergraduate(appl.program)}
									{formatMajors(appl) || '-'}
								{:else}
									{appl.program.display_name}
								{/if}
							</TableBodyCell>

							<TableBodyCell class="font-normal max-w-16">{appl.round.name}</TableBodyCell>
							<TableBodyCell class="font-normal">
								{toShortDate(appl.round.due_date) || '-'}
							</TableBodyCell>
							<TableBodyCell class="">{appl.latest_log?.status ?? '-'}</TableBodyCell>
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
