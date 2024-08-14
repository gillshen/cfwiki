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
	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import SchoolInfobox from '$lib/components/infobox/SchoolInfobox.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import { fetchApplications, type ApplicationListItem } from '$lib/api/application.js';
	import { toShortDate } from '$lib/utils/dateUtils.js';

	export let data;

	let updateSchoolModal = false;

	let applications: Promise<ApplicationListItem[]> = fetchApplications({ school: data.school.id });
</script>

<Heading tag="h1" class="alt-page-title">{data.school.name}</Heading>

<Hr />

<Main>
	<article>
		<SchoolInfobox school={data.school} />

		<div class="mt-8">
			{#await applications then applications}
				<UpdateDeleteButton
					text="Actions"
					updateAction={() => (updateSchoolModal = true)}
					deleteAction={() => alert('delete')}
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
						<TableHeadCell>Type</TableHeadCell>
						<TableHeadCell>Student</TableHeadCell>
						<TableHeadCell>Program/Major</TableHeadCell>
						<TableHeadCell>Round</TableHeadCell>
						<TableHeadCell>Due</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each applications as appl}
							<TableBodyRow>
								<TableBodyCell class="w-4 pl-2">
									<A href={`/application/${appl.id}`}>
										<ArrowUpRightFromSquareOutline />
									</A>
								</TableBodyCell>
								<TableBodyCell class="font-normal">{appl.program_iteration.year}</TableBodyCell>
								<TableBodyCell class="font-normal">{appl.program.type}</TableBodyCell>
								<TableBodyCell class="max-w-20">{appl.student.fullname}</TableBodyCell>
								<!-- TODO major or program -->
								<TableBodyCell class="font-normal max-w-48 truncate">
									{appl.program.display_name}
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
	</article>
</Main>

<FormModal
	open={updateSchoolModal}
	superform={data.schoolForm}
	fields={SchoolForm}
	action="?/updateSchool"
	entity={data.school}
	extra={[{ name: 'id', type: 'number', value: data.school.id }]}
	title="Update school information"
	on:close={() => (updateSchoolModal = false)}
/>
