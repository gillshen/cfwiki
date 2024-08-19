<script lang="ts">
	import {
		Heading,
		Hr,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import Main from '$lib/components/containers/Main.svelte';
	import ProgramInfobox from '$lib/components/infobox/ProgramInfobox.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';
	import Majors from '$lib/components/table-cells/Majors.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
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
	import Student from '$lib/components/table-cells/Student.svelte';

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

		<div class="mt-8">
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
	</article>

	<article class="bg-stone-50 rounded-xl w-full p-8">(Stats)</article>

	<article class="col-span-2 mt-24">
		<ApplicationsLoader applications={data.applications}>
			<svelte:fragment let:applications>
				<Table class="mt-8" hoverable={applications.length > 1}>
					<TableHead>
						<TableHeadCell></TableHeadCell>
						<TableHeadCell>Year</TableHeadCell>
						<TableHeadCell>Student</TableHeadCell>
						{#if isUndergraduate(data.program)}
							<TableHeadCell>Major</TableHeadCell>
						{/if}
						<TableHeadCell>Round</TableHeadCell>
						<TableHeadCell>Due</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
					</TableHead>

					<TableBody>
						{#each applications
							.sort(orderByStudentName)
							.sort(orderByStatus)
							.sort(orderByRoundName)
							.sort(orderByYearDesc) as appl}
							<TableBodyRow>
								<ApplicationLink application={appl} />
								<TableBodyCell class="font-normal">{appl.program_iteration.year}</TableBodyCell>
								<Student application={appl} />
								{#if isUndergraduate(data.program)}
									<Majors application={appl} />
								{/if}
								<ApplicationRound application={appl} />
								<ShortDate date={appl.round.due_date} />
								<ApplicationStatus application={appl} />
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
