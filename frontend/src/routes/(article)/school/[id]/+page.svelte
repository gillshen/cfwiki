<script lang="ts">
	import { Heading, Hr, Timeline, TimelineItem, WidgetPlaceholder } from 'flowbite-svelte';

	import Main from '$lib/components/containers/Main.svelte';
	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import SchoolInfobox from '$lib/components/infobox/SchoolInfobox.svelte';
	import ProgramsListBox from '$lib/components/program-page/ProgramsListBox.svelte';
	import ApplicationStatsDoughnut from '$lib/components/application-stats/ApplicationStatsDoughnut.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationsAccordian from '$lib/components/containers/ApplicationsAccordian.svelte';
	import ApplicationsTable from '$lib/components/school-page/ApplicationsTable.svelte';
	import AlumApplicationsTable from '$lib/components/school-page/AlumApplicationsTable.svelte';
	import EnrollmentsLoader from '$lib/components/misc/EnrollmentsLoader.svelte';
	import EnrollmentsTable from '$lib/components/school-page/EnrollmentsTable.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';

	import {
		getStats,
		groupByType,
		groupByYear,
		isGraduate,
		isUndergraduate
	} from '$lib/utils/applicationUtils';

	export let data;

	let schoolUpdateModal = false;
	let schoolDeleteModal = false;

	$: isNotSecondarySchool = data.school.type !== 'Secondary School';
</script>

<Heading tag="h1" class="alt-page-title">{data.school.name}</Heading>

<Hr />

<Main>
	<article>
		<SchoolInfobox school={data.school} />

		<div class="mt-3">
			{#await Promise.all([data.applications, data.enrollments]) then [applications, enrollments]}
				<UpdateDeleteButton
					updateAction={() => (schoolUpdateModal = true)}
					deleteAction={() => (schoolDeleteModal = true)}
					deleteDisabled={!!applications.length || !!enrollments.length}
				/>
			{/await}
		</div>

		{#if isNotSecondarySchool}
			<div class="mt-16">
				<Heading tag="h2" class="section-title">Programs</Heading>
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
		{/if}
	</article>

	<article class="flex flex-col gap-8">
		{#await data.applications}
			<WidgetPlaceholder />
		{:then applications}
			{#if isNotSecondarySchool}
				<div class="bg-stone-50 rounded-xl w-full p-8">
					<ApplicationStatsDoughnut
						stats={getStats(applications.filter(isUndergraduate))}
						title="Undergraduate Statistics"
						href={`/school/${data.school.id}/stats/undergraduate`}
					/>
				</div>

				<div class="bg-stone-50 rounded-xl w-full p-8">
					<ApplicationStatsDoughnut
						stats={getStats(applications.filter(isGraduate))}
						title="Graduate Statistics"
						href={`/school/${data.school.id}/stats/graduate`}
					/>
				</div>
			{:else}
				<div class="bg-stone-50 rounded-xl w-full p-8">
					<ApplicationStatsDoughnut
						stats={getStats(applications)}
						title="Student & Alumni Statistics"
						href={`/school/${data.school.id}/stats/alumni`}
					/>
				</div>
			{/if}
		{/await}
	</article>

	<article class="col-span-2 mt-16">
		<EnrollmentsLoader enrollments={data.enrollments}>
			<svelte:fragment let:enrollments>
				<EnrollmentsTable {enrollments} schoolType={data.school.type} />
			</svelte:fragment>
		</EnrollmentsLoader>
	</article>

	<article class="col-span-2 mt-16">
		<ApplicationsLoader
			heading={isNotSecondarySchool ? 'Applications' : 'Applications by Students & Alumni'}
			applications={data.applications}
		>
			<svelte:fragment let:applications>
				<ApplicationsAccordian groupedApplications={groupByYear(applications)}>
					<svelte:fragment let:subsetOfApplications>
						{#each Object.entries(groupByType(subsetOfApplications)) as [applType, subSubsetOfApplications]}
							<!-- introduce a div to override the style of <li> -->
							<div class="school-page-applications">
								<Timeline class="ml-1 -mb-4">
									<TimelineItem title={`${applType} (${subSubsetOfApplications.length})`}>
										{#if isNotSecondarySchool}
											<ApplicationsTable
												applications={subSubsetOfApplications}
												isUndergraduate={applType.startsWith('UG')}
											/>
										{:else}
											<AlumApplicationsTable applications={subSubsetOfApplications} />
										{/if}
									</TimelineItem>
								</Timeline>
							</div>
						{/each}
					</svelte:fragment>
				</ApplicationsAccordian>
			</svelte:fragment>
		</ApplicationsLoader>
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
