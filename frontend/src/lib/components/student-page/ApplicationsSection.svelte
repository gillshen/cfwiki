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
	import ApplicationsAccordian from '$lib/components/containers/ApplicationsAccordian.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import ProgramType from '$lib/components/table-cells/ProgramType.svelte';
	import Schools from '$lib/components/table-cells/Schools.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';

	import {
		groupByYear,
		orderByDueDate,
		orderBySchoolName,
		orderByStatus,
		orderByYearDesc
	} from '$lib/utils/applicationUtils';

	export let student: StudentDetail;
	export let applications: Promise<ApplicationListItem[]>;
	export let canEdit: boolean = false;
</script>

<article class="mt-16 col-span-2">
	<ApplicationsLoader {applications}>
		<svelte:fragment let:applications>
			<ApplicationsAccordian groupedApplications={groupByYear(applications)} divClass="mt-4">
				<svelte:fragment let:subsetOfApplications>
					<Table hoverable={applications.length > 1}>
						<TableHead>
							<TableHeadCell></TableHeadCell>
							<TableHeadCell class="w-16">Type</TableHeadCell>
							<TableHeadCell class="w-40">Status</TableHeadCell>
							<TableHeadCell class="w-[20rem]">School</TableHeadCell>
							<TableHeadCell class="w-[30rem]">Program/Major</TableHeadCell>
							<TableHeadCell class="w-40">Adm. plan</TableHeadCell>
							<TableHeadCell class="w-40">Due</TableHeadCell>
						</TableHead>

						<TableBody>
							{#each subsetOfApplications
								.sort(orderBySchoolName)
								.sort(orderByDueDate)
								.sort(orderByStatus)
								.sort(orderByYearDesc) as application}
								<TableBodyRow>
									<ApplicationLink {application} />
									<ProgramType {application} />
									<ApplicationStatus {application} />
									<Schools {application} />
									<ProgramOrMajors {application} />
									<ApplicationRound {application} />
									<ShortDate date={application.round.due_date} />
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
				</svelte:fragment>
			</ApplicationsAccordian>
		</svelte:fragment>
	</ApplicationsLoader>

	{#if canEdit && student.contracts_sorted.length}
		<Button outline href={`/student/${student.id}/dream`} class="mt-8">
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
