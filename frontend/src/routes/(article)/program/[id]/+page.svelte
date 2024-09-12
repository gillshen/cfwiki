<script lang="ts">
	import { goto } from '$app/navigation';
	import { Heading, Hr, Alert, WidgetPlaceholder } from 'flowbite-svelte';
	import { PlusOutline, InfoCircleOutline } from 'flowbite-svelte-icons';

	import Main from '$lib/components/containers/Main.svelte';
	import ProgramInfobox from '$lib/components/infobox/ProgramInfobox.svelte';
	import Button from '$lib/components/buttons/Button.svelte';
	import UpdateButton from '$lib/components/buttons/UpdateButton.svelte';
	import DeleteButton from '$lib/components/buttons/DeleteButton.svelte';
	import ApplicationRoundsBox from '$lib/components/program-page/ApplicationRoundsBox.svelte';
	import ApplicationStatsDoughnut from '$lib/components/application-stats/ApplicationStatsDoughnut.svelte';
	import ApplicationsLoader from '$lib/components/misc/ApplicationsLoader.svelte';
	import ApplicationsAccordian from '$lib/components/containers/ApplicationsAccordian.svelte';
	import ApplicationsTable from '$lib/components/program-page/ApplicationsTable.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ProgramForm from '$lib/components/program-form/ProgramForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { formatSchoolNamesShort, isUndergraduate } from '$lib/utils/programUtils';
	import { getStats, groupByYear } from '$lib/utils/applicationUtils';

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
				<InfoCircleOutline />
				<span>This program is defunct and no longer accepting applications.</span>
			</Alert>
		{/if}

		<ProgramInfobox program={data.program} />

		<div class="mt-3 flex gap-4 items-baseline">
			{#await data.applications then applications}
				<UpdateButton onClick={() => (programUpdateModal = true)} />
				<DeleteButton
					onClick={() => (programDeleteModal = true)}
					disabled={!!applications.length}
				/>
			{/await}
		</div>

		<div class="mt-16">
			<Heading tag="h2" class="section-title">Admission Plans</Heading>

			<div class="mt-6">
				{#await data.applicationRounds}
					<FetchingDataSign />
				{:then applRounds}
					{#if applRounds.length}
						<ApplicationRoundsBox {applRounds} deleteForm={data.deleteForm} />
					{:else}
						<NoDataSign text="None" divClass="mt-6" />
					{/if}
				{/await}
			</div>

			<div class="mt-6">
				<Button
					onClick={() => goto(`/program/${data.program.id}/plan/new`)}
					text="Add an Admission Plan"
					icon={PlusOutline}
				/>
			</div>
		</div>
	</article>

	<article class="bg-stone-50 rounded-xl w-full p-8 h-fit">
		{#await data.applications}
			<WidgetPlaceholder />
		{:then applications}
			<ApplicationStatsDoughnut
				stats={getStats(applications)}
				href={`/program/${data.program.id}/stats`}
			/>
		{/await}
	</article>

	<article class="col-span-2 mt-16">
		<ApplicationsLoader applications={data.applications}>
			<svelte:fragment let:applications>
				<ApplicationsAccordian groupedApplications={groupByYear(applications)}>
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
