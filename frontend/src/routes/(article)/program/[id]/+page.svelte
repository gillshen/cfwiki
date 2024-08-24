<script lang="ts">
	import { goto } from '$app/navigation';

	import {
		Heading,
		Hr,
		Table,
		TableBody,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import { PlusOutline } from 'flowbite-svelte-icons';

	import Main from '$lib/components/containers/Main.svelte';
	import ProgramInfobox from '$lib/components/infobox/ProgramInfobox.svelte';
	import ApplicationRoundsBox from '$lib/components/program-page/ApplicationRoundsBox.svelte';
	import ApplicationStats from '$lib/components/application-stats/ApplicationStats.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import LinkButton from '$lib/components/buttons/LinkButton.svelte';

	import Student from '$lib/components/table-cells/Student.svelte';
	import MajorsOrTrack from '$lib/components/table-cells/MajorsOrTrack.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import PlainCell from '$lib/components/table-cells/PlainCell.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ProgramForm from '$lib/components/program-form/ProgramForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { formatSchoolNamesShort, isUndergraduate } from '$lib/utils/programUtils';

	import {
		orderByRoundName,
		orderByStatus,
		orderByYearDesc,
		orderByStudentName
	} from '$lib/utils/applicationUtils';

	export let data;

	let programUpdateModal = false;
	let programDeleteModal = false;
</script>

<Heading tag="h1" class="alt-page-title">
	{formatSchoolNamesShort(data.program)} | {data.program.display_name}
</Heading>

<Hr />

<Main>
	<article>
		<ProgramInfobox program={data.program} />

		<div class="mt-4">
			{#await data.applications then applications}
				<UpdateDeleteButton
					text="Actions"
					updateAction={() => (programUpdateModal = true)}
					deleteAction={() => (programDeleteModal = true)}
					updateDisabled={isUndergraduate(data.program)}
					deleteDisabled={!!applications.length}
				/>
			{/await}
		</div>

		<div class="mt-16">
			<Heading tag="h2" class="text-2xl font-bold">Admission plans</Heading>

			<div class="mt-4">
				{#await data.applicationRounds}
					<FetchingDataSign />
				{:then applRounds}
					{#if applRounds.length}
						<ApplicationRoundsBox {applRounds} />
					{:else}
						<NoDataSign text="No admission plans" divClass="mt-6" />
					{/if}
				{/await}
			</div>

			<div class="mt-8">
				<LinkButton
					text="Add an admission plan"
					action={() => goto(`/program/${data.program.id}/plan/new`)}
				>
					<PlusOutline slot="icon" />
				</LinkButton>
			</div>
		</div>
	</article>

	<article class="bg-stone-50 rounded-xl w-full p-8 h-fit">
		<ApplicationStats stats={data.program.application_stats} />
	</article>

	<article class="col-span-2 mt-16">
		<ApplicationsLoader applications={data.applications}>
			<svelte:fragment let:applications>
				<!-- TODO divide by year -->
				<Table divClass="mt-8" hoverable={applications.length > 1}>
					<TableHead>
						<TableHeadCell></TableHeadCell>
						<TableHeadCell>Year</TableHeadCell>
						<TableHeadCell>Student</TableHeadCell>
						<TableHeadCell>{isUndergraduate(data.program) ? 'Major' : 'Track'}</TableHeadCell>
						<TableHeadCell>Adm. plan</TableHeadCell>
						<TableHeadCell>Due</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
					</TableHead>

					<TableBody>
						{#each applications
							.sort(orderByStudentName)
							.sort(orderByStatus)
							.sort(orderByRoundName)
							.sort(orderByYearDesc) as application}
							<TableBodyRow>
								<ApplicationLink {application} />
								<PlainCell text={application.program_iteration.year} />
								<Student {application} />
								<MajorsOrTrack {application} />
								<ApplicationRound {application} />
								<ShortDate date={application.round.due_date} />
								<ApplicationStatus {application} />
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</svelte:fragment>
		</ApplicationsLoader>
	</article>
</Main>

<FormModal
	open={programUpdateModal}
	superform={data.programForm}
	fields={ProgramForm}
	action="?/updateProgram"
	entity={data.program}
	extra={[{ name: 'id', type: 'number', value: data.program.id }]}
	title="Update program information"
	on:close={() => (programUpdateModal = false)}
/>

<FormModal
	open={programDeleteModal}
	superform={data.deleteForm}
	fields={DeleteForm}
	action="?/deleteProgram"
	entity={data.program}
	title="Delete program"
	on:close={() => (programDeleteModal = false)}
>
	<DeleteMessage slot="preface" name="this program" />
</FormModal>
