<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import CoApplicationsDisplay from '$lib/components/widgets/CoApplicationsDisplay.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import ProgramForm from '$lib/components/forms/program-form/ProgramForm.svelte';
	import NewApplicationRoundForm from '$lib/components/forms/application-round-form/NewApplicationRoundForm.svelte';
	import { createTitle } from '$lib/util/siteUtils';
	import { joinNames } from '$lib/util/schoolUtils';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import ApplicationRoundUpdateForm from '$lib/components/forms/application-round-form/ApplicationRoundUpdateForm.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';

	export let data;

	const schoolNames = joinNames(data.program.schools, { alt: true });
	const title = `${schoolNames} \u2022 ${data.program.display_name}`;
</script>

<svelte:head>
	<title>{createTitle(title)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/program/index">Programs</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{title}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<pre class="text-sm bg-muted rounded-md p-4 mb-4">{JSON.stringify(data.program, null, 2)}</pre>

{#await data.applicationRounds}
	<div>fetching application rounds</div>
{:then applicationRounds}
	<div class="flex flex-wrap gap-4">
		{#each applicationRounds as round}
			<div class="flex flex-col">
				<pre class="text-sm bg-muted rounded-md p-4 mb-4">{JSON.stringify(round, null, 2)}</pre>
				<div class="flex gap-2">
					<ButtonDialog buttonText="Edit" dialogTitle="Update Admission Plan">
						<ApplicationRoundUpdateForm
							data={data.applicationRoundUpdateForm}
							applicationRound={round}
							onUpdated={({ form }) => form.valid && alert('success')}
						/>
					</ButtonDialog>
					<ButtonDialog
						buttonText="Delete"
						dialogTitle="Delete this admission plan?"
						contentClass="pb-2"
					>
						<DeleteForm
							data={data.deleteForm}
							objectId={round.id}
							action="?/deleteApplicationRound"
						/>
					</ButtonDialog>
				</div>
			</div>
		{/each}
	</div>
{/await}

<div class="my-6 w-fit border border-primary/50 rounded-lg p-6">
	<NewApplicationRoundForm
		data={data.newApplicationRoundForm}
		programId={data.program.id}
		onUpdated={() => alert('success')}
	/>
</div>

<div class="my-6 w-fit border border-primary/50 rounded-lg p-6">
	<ProgramForm
		data={data.programForm}
		program={data.program}
		action="?/updateProgram"
		onUpdated={() => alert('success')}
		class="mx-0"
	/>
</div>

<Section id="applications" title="Applications">
	{#await data.applications}
		<LoadingSign />
	{:then applications}
		<CoApplicationsDisplay {applications} />
	{/await}
</Section>
