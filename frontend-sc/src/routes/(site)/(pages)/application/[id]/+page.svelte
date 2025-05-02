<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import FormButton from '$lib/components/ui/form/form-button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import CoApplicationsDisplay from '$lib/components/widgets/CoApplicationsDisplay.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import * as Timeline from '$lib/components/widgets/timeline/index';
	import ApplicationLogForm from '$lib/components/forms/ApplicationLogForm.svelte';
	import ApplicationLogItem from '$lib/components/widgets/application-log/ApplicationLogItem.svelte';
	import type { ApplicationLog } from '$lib/api/applicationLog';
	import { createTitle } from '$lib/util/siteUtils';
	import { joinNames } from '$lib/util/schoolUtils';

	export let data;

	let deleteModalOpen = false;
	let newLogModalOpen: boolean = false;

	const { student, program_iteration, round, program, schools } = data.application;
	const schoolNames = joinNames(data.application.schools);
	const title = `${data.application.student.fullname} \u2022 ${schoolNames}`;

	const deleteForm = superForm(data.deleteForm, { id: 'delete-form' });
	const { form: delFormData, enhance: delFormEnhance } = deleteForm;

	const logForm = superForm(data.logForm, {
		id: `log-form-new`,
		onUpdated({ form }) {
			if (form.valid) {
				newLogModalOpen = false;
			}
		}
	});
	const { enhance: logFormEnhance } = logForm;

	$: logs = data.application.logs.sort((a: ApplicationLog, b: ApplicationLog) => {
		if (a.date !== b.date) {
			return a.date.localeCompare(b.date);
		} else {
			return a.updated.localeCompare(b.updated);
		}
	});
</script>

<svelte:head>
	<title>{createTitle(title)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>Applications</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{title}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-2 space-y-2">
	<h1 class="page-title flex gap-2">
		<div>{student.fullname}</div>
		{#if schools.length}
			<div>&bullet;</div>
			<div>{schoolNames}</div>
		{/if}
	</h1>
	<div class="flex gap-3 items-center">
		<Badge variant="default">{program.type}</Badge>
		{#key data.application.logs}
			<ApplicationStatusSign application={data.application} />
		{/key}
	</div>
</section>

<Section id="info">
	<div class="grid grid-cols-2 gap-6">
		<article class="mt-4 text-sm flex flex-col gap-2 bg-zinc-50 px-8 pt-6 pb-8 rounded-lg">
			<a href="/student/{student.id}">{student.fullname}</a>
			<div class="flex flex-col gap-2">
				{#each schools as school}
					<a href="/school/{school.id}">{school.name}</a>
				{/each}
			</div>
			<a href="/program/{program.id}">{program.display_name}</a>
			<div>{program_iteration.year} {program_iteration.term}</div>
			<div>{round.name} {round.due_date ?? ''} {round.due_time ?? ''} {round.timezone ?? ''}</div>

			<pre>{JSON.stringify({ services: data.application.services }, null, 2)}</pre>
			{#each data.application.staff.sort() as staff}
				<a href="/cf/{staff}">{staff}</a>
			{/each}

			<pre>{JSON.stringify(
					{
						major_1: data.application.major_1,
						major_2: data.application.major_2,
						major_3: data.application.major_3,
						comments: data.application.comments
					},
					null,
					2
				)}</pre>
		</article>

		<article class="mt-4 text-sm flex flex-col gap-2 bg-zinc-50 px-8 pt-6 pb-8 rounded-lg">
			<h2 class="text-xl font-bold">History</h2>

			{#if data.application.logs.length}
				<Timeline.Root class="mt-4">
					{#key logs}
						{#each logs as log}
							<ApplicationLogItem
								{log}
								application={data.application}
								canEdit={data.userCanEdit}
								updateForm={data.logForm}
								deleteForm={data.deleteForm}
							/>
						{/each}
					{/key}
				</Timeline.Root>
			{/if}

			{#if data.userCanEdit}
				<div class="mt-4">
					<ButtonDialog
						buttonText="New Status"
						dialogTitle="New Application Status"
						bind:open={newLogModalOpen}
					>
						<form
							method="POST"
							action="?/createOrUpdateApplicationLog"
							class="max-w-prose space-y-4 my-4 mx-auto"
							use:logFormEnhance
							id="log-form-new"
						>
							<ApplicationLogForm form={logForm} application={data.application} />
						</form>
					</ButtonDialog>
				</div>
			{/if}
		</article>
	</div>
</Section>

<Section
	id="coapplications"
	title="Other Applicants of {program_iteration.term} {program_iteration.year}"
>
	{#await data.coApplications}
		<LoadingSign />
	{:then applications}
		<CoApplicationsDisplay {applications} hideYears noDataMessage="None." />
	{/await}
</Section>

{#if data.userCanEdit}
	<Section id="delete" hrule>
		<div>
			<ButtonDialog
				buttonText="Delete Application"
				buttonVariant="destructive"
				dialogTitle="Delete this application?"
				bind:open={deleteModalOpen}
			>
				<svelte:fragment slot="description">This action cannot be undone.</svelte:fragment>
				<form
					method="POST"
					action="?/deleteApplication"
					class="max-w-prose space-y-4 pb-2"
					use:delFormEnhance
					id="delete-form"
				>
					<input type="number" name="id" bind:value={$delFormData.id} hidden />

					<div class="mx-auto mt-4 w-fit">
						<FormButton variant="destructive">Delete</FormButton>
						<Button variant="ghost" on:click={() => (deleteModalOpen = false)}>Cancel</Button>
					</div>
				</form>
			</ButtonDialog>
		</div>
	</Section>
{/if}

{#await data.promisedRounds then rounds}
	<!-- for round-change form -->
	<pre class="mt-4 text-sm bg-zinc-100 p-2 rounded-lg h-[200px] overflow-auto">{JSON.stringify(
			rounds,
			null,
			2
		)}</pre>
{/await}
