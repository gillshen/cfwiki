<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';

	import {
		Button,
		Helper,
		Table,
		TableBody,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import type { StudentDetail } from '$lib/api/student';
	import type { ComposedApplication } from '$lib/api/application';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationsAccordian from '$lib/components/containers/ApplicationsAccordian.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import ProgramType from '$lib/components/table-cells/ProgramType.svelte';
	import Schools from '$lib/components/table-cells/Schools.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ApplicationPrepForm from '$lib/components/application-prep-form/ApplicationPrepForm.svelte';

	import {
		groupByYear,
		orderByDueDate,
		orderBySchoolName,
		orderByStatus,
		orderByYearDesc
	} from '$lib/utils/applicationUtils';

	export let student: StudentDetail;
	export let applications: Promise<ComposedApplication[]>;
	export let form: SuperValidated<any>;
	export let canEdit: boolean = false;

	let newApplicationModal = false;
</script>

<ApplicationsLoader {applications}>
	<svelte:fragment let:applications>
		<ApplicationsAccordian groupedApplications={groupByYear(applications)}>
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
								<ShortDate date={application.due_date} />
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</svelte:fragment>
		</ApplicationsAccordian>
	</svelte:fragment>
</ApplicationsLoader>

{#if canEdit && student.contracts.length}
	<Button outline on:click={() => (newApplicationModal = true)} class="mt-8">
		Create applications
	</Button>
{:else if canEdit}
	<Button outline disabled class="mt-8">Create applications</Button>
	<Helper class="form-helper font-medium mt-2 max-w-[20rem]">
		Applications must be attached to an existing contract. Add a contract first to enable this
		option.
	</Helper>
{/if}

<FormModal
	open={newApplicationModal}
	superform={form}
	fields={ApplicationPrepForm}
	action={`/student/${student.id}?/initiateApplication`}
	entity={student}
	title="Create applications"
	on:close={() => (newApplicationModal = false)}
/>
