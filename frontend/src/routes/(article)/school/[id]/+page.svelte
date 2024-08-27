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
	import ApplicationStats from '$lib/components/application-stats/ApplicationStats.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import EnrollmentsLoader from '$lib/components/misc/EnrollmentsLoader.svelte';
	import ApplicationLink from '$lib/components/table-cells/ApplicationLink.svelte';
	import Student from '$lib/components/table-cells/Student.svelte';
	import ProgramOrMajors from '$lib/components/table-cells/ProgramOrMajors.svelte';
	import ShortYearMonth from '$lib/components/table-cells/ShortYearMonth.svelte';
	import ShortDate from '$lib/components/table-cells/ShortDate.svelte';
	import ProgramType from '$lib/components/table-cells/ProgramType.svelte';
	import ApplicationRound from '$lib/components/table-cells/ApplicationRound.svelte';
	import ApplicationStatus from '$lib/components/table-cells/ApplicationStatus.svelte';
	import PlainCell from '$lib/components/table-cells/PlainCell.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import ProgramsListBox from '$lib/components/program-page/ProgramsListBox.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';

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

		<div class="mt-2">
			{#await Promise.all([data.applications, data.enrollments]) then [applications, enrollments]}
				<UpdateDeleteButton
					updateAction={() => (schoolUpdateModal = true)}
					deleteAction={() => (schoolDeleteModal = true)}
					deleteDisabled={!!applications.length || !!enrollments.length}
				/>
			{/await}
		</div>

		<div>
			<Heading tag="h2" class="text-2xl font-bold mt-16">Programs</Heading>
			{#await data.programs}
				<FetchingDataSign divClass="mt-8" />
			{:then programs}
				{#if programs.length}
					<ProgramsListBox {programs} />
				{:else}
					<NoDataSign text="None" divClass="mt-6" />
				{/if}
			{/await}
		</div>
	</article>

	<article class="flex flex-col gap-8">
		<div class="bg-stone-50 rounded-xl w-full p-8">
			<ApplicationStats stats={data.school.application_stats.ug} title="Undergraduate statistics" />
		</div>

		<div class="bg-stone-50 rounded-xl w-full p-8">
			<ApplicationStats stats={data.school.application_stats.grad} title="Graduate statistics" />
		</div>
	</article>

	{#if data.school.type !== 'Secondary School'}
		<article class="col-span-2 mt-16">
			<ApplicationsLoader applications={data.applications}>
				<svelte:fragment let:applications>
					<!-- TODO divide by year and type -->
					<Table divClass="mt-8" hoverable={applications.length > 1}>
						<TableHead>
							<TableHeadCell></TableHeadCell>
							<TableHeadCell>Year</TableHeadCell>
							<TableHeadCell>Type</TableHeadCell>
							<TableHeadCell>Student</TableHeadCell>
							<TableHeadCell>Program/Major</TableHeadCell>
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
									<ProgramType {application} />
									<Student {application} />
									<ProgramOrMajors {application} />
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
	{/if}

	<article class="col-span-2 mt-16">
		<EnrollmentsLoader enrollments={data.enrollments}>
			<svelte:fragment let:enrollments>
				<Table divClass="mt-8" hoverable={enrollments.length > 1}>
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
