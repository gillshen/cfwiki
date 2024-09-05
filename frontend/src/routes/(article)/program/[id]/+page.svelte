<script lang="ts">
	import { goto } from '$app/navigation';
	import { Heading, Hr, Alert, WidgetPlaceholder } from 'flowbite-svelte';
	import { PlusOutline, InfoCircleSolid } from 'flowbite-svelte-icons';

	import Main from '$lib/components/containers/Main.svelte';
	import ProgramInfobox from '$lib/components/infobox/ProgramInfobox.svelte';
	import ApplicationRoundsBox from '$lib/components/program-page/ApplicationRoundsBox.svelte';
	import ApplicationStatsDisplay from '$lib/components/application-stats/ApplicationStatsDisplay.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationsAccordian from '$lib/components/containers/ApplicationsAccordian.svelte';
	import ApplicationsTable from '$lib/components/program-page/ApplicationsTable.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import LinkButton from '$lib/components/buttons/LinkButton.svelte';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ProgramForm from '$lib/components/program-form/ProgramForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { formatSchoolNamesShort, isUndergraduate } from '$lib/utils/programUtils';
	import { groupByYear } from '$lib/utils/applicationUtils';
	import { lackOfStats } from '$lib/api/stats';

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
		{#if data.program.is_defunct}
			<Alert color="red" class="mb-4 flex gap-2">
				<InfoCircleSolid />
				<span>This program is defunct and no longer accepting applications.</span>
			</Alert>
		{/if}

		<ProgramInfobox program={data.program} />

		<div class="mt-3">
			{#await data.applications then applications}
				<UpdateDeleteButton
					updateAction={() => (programUpdateModal = true)}
					deleteAction={() => (programDeleteModal = true)}
					deleteDisabled={!!applications.length}
				/>
			{/await}
		</div>

		<div class="mt-16">
			<Heading tag="h2" class="section-title">Admission Plans</Heading>

			<div class="mt-4">
				{#await data.applicationRounds}
					<FetchingDataSign />
				{:then applRounds}
					{#if applRounds.length}
						<ApplicationRoundsBox {applRounds} deleteForm={data.deleteForm} />
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
					<PlusOutline slot="icon" class="-ml-0.5" />
				</LinkButton>
			</div>
		</div>
	</article>

	<article class="bg-stone-50 rounded-xl w-full p-8 h-fit">
		{#await data.statsItems}
			<WidgetPlaceholder />
		{:then statsItems}
			<ApplicationStatsDisplay stats={statsItems[0] ?? lackOfStats} />
		{/await}
	</article>

	<article class="col-span-2 mt-16">
		<ApplicationsLoader applications={data.applications} applicants={data.applicants}>
			<svelte:fragment let:applications>
				<ApplicationsAccordian groupedApplications={groupByYear(applications)} divClass="mt-4">
					<svelte:fragment let:subsetOfApplications>
						<ApplicationsTable
							applications={subsetOfApplications}
							isUndergraduate={isUndergraduate(data.program)}
						/>
					</svelte:fragment>
				</ApplicationsAccordian>
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
