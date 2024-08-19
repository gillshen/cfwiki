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

	import Main from '$lib/components/containers/Main.svelte';
	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import SchoolInfobox from '$lib/components/infobox/SchoolInfobox.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import EnrollmentsLoader from '$lib/components/misc/EnrollmentsLoader.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ShortYearMonth from '$lib/components/table-cells/ShortYearMonth.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import PlainCell from '$lib/components/table-cells/PlainCell.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	import {
		orderByRoundName,
		orderByStatus,
		orderByYearDesc,
		orderByStudentName
	} from '$lib/utils/applicationUtils';

	export let data;

	let schoolUpdateModal = false;
	let schoolDeleteModal = false;
</script>

<Heading tag="h1" class="alt-page-title">{data.school.name}</Heading>

<Hr />

<Main>
	<article>
		<SchoolInfobox school={data.school} />

		<div class="mt-8">
			{#await Promise.all([data.applications, data.enrollments]) then [applications, enrollments]}
				<UpdateDeleteButton
					text="Actions"
					updateAction={() => (schoolUpdateModal = true)}
					deleteAction={() => (schoolDeleteModal = true)}
					deleteDisabled={!!applications.length || !!enrollments.length}
				/>
			{/await}
		</div>
	</article>

	<article class="bg-stone-50 rounded-xl w-full p-8">(Stats)</article>

	{#if data.school.type !== 'Secondary School'}
		<article class="col-span-2 mt-24">
			<ApplicationsLoader applications={data.applications}>
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
							{#each applications
								.sort(orderByStudentName)
								.sort(orderByStatus)
								.sort(orderByRoundName)
								.sort(orderByYearDesc) as appl}
								<TableBodyRow>
									<ApplicationLink application={appl} />
									<PlainCell text={appl.program_iteration.year} />
									<PlainCell text={appl.program.type} />
									<Student application={appl} />
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
		</article>
	{/if}

	<article class="col-span-2 mt-24">
		<EnrollmentsLoader enrollments={data.enrollments}>
			<svelte:fragment let:enrollments>
				<Table class="mt-8" hoverable={enrollments.length > 1}>
					<TableHead>
						<TableHeadCell class="pl-2"></TableHeadCell>
						<TableHeadCell>Start date</TableHeadCell>
						<TableHeadCell>End date</TableHeadCell>
						<TableHeadCell>
							{data.school.type === 'Secondary School' ? 'Curriculum' : 'Major'}
						</TableHeadCell>
						<TableHeadCell>Contract in effect</TableHeadCell>
					</TableHead>

					<TableBody>
						{#each enrollments as enrollment}
							<TableBodyRow>
								<TableBodyCell class="pl-2">
									<A href={`/student/${enrollment.student.id}`}>{enrollment.student.fullname}</A>
								</TableBodyCell>
								<ShortYearMonth date={enrollment.start_date} />
								<ShortYearMonth date={enrollment.end_date} />
								<PlainCell text={enrollment.curriculum} />
								<TableBodyCell>
									{#if enrollment.student.latest_contract.status === 'In effect'}
										<span class="text-green-500">Yes</span>
									{:else}
										<span class="text-gray-500">No</span>
									{/if}
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</svelte:fragment>
		</EnrollmentsLoader>
	</article>
</Main>

<FormModal
	open={schoolUpdateModal}
	superform={data.schoolForm}
	fields={SchoolForm}
	action="?/updateSchool"
	entity={data.school}
	extra={[{ name: 'id', type: 'number', value: data.school.id }]}
	title="Update school information"
	on:close={() => (schoolUpdateModal = false)}
/>

<FormModal
	open={schoolDeleteModal}
	superform={data.deleteForm}
	fields={DeleteForm}
	action="?/deleteSchool"
	entity={data.school}
	title="Delete school"
	on:close={() => (schoolDeleteModal = false)}
>
	<DeleteMessage slot="preface" name={`this school (${data.school.name})`} />
</FormModal>
