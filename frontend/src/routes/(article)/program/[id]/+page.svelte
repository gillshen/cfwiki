<script lang="ts">
	import {
		Heading,
		Hr,
		A,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	import Main from '$lib/components/containers/Main.svelte';
	import ProgramInfobox from '$lib/components/infobox/ProgramInfobox.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ProgramForm from '$lib/components/program-form/ProgramForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { formatSchoolNamesShort, isUndergraduate } from '$lib/api/program';
	import { fetchApplications, type ApplicationListItem } from '$lib/api/application';
	import { toShortDate } from '$lib/utils/dateUtils';

	export let data;

	let applications: Promise<ApplicationListItem[]> = fetchApplications({
		program: data.program.id
	});

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
			{#await applications then applications}
				<UpdateDeleteButton
					updateAction={() => (programUpdateModal = true)}
					deleteAction={() => (programDeleteModal = true)}
					updateDisabled={isUndergraduate(data.program)}
					deleteDisabled={!!applications.length}
				/>
			{/await}
		</div>
	</article>

	<article class="bg-slate-50 rounded-xl w-full p-8">(Stats)</article>

	<article class="col-span-2 mt-24">
		<ApplicationsLoader {applications}>
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
						{#each applications as appl}
							<TableBodyRow>
								<TableBodyCell class="w-4 pl-2">
									<A href={`/application/${appl.id}`}><ArrowUpRightFromSquareOutline /></A>
								</TableBodyCell>
								<TableBodyCell class="font-normal">{appl.program_iteration.year}</TableBodyCell>
								<TableBodyCell class="max-w-20">{appl.student.fullname}</TableBodyCell>
								{#if isUndergraduate(data.program)}
									<TableBodyCell class="font-normal">
										<span class="text-gray-400">TODO</span>
									</TableBodyCell>
								{/if}
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
