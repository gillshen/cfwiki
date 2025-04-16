<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import CoApplicationsDisplay from '$lib/components/widgets/CoApplicationsDisplay.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';

	export let data;

	let canEdit: boolean = true;

	const { student, program_iteration, round, program, schools } = data.application;
	const schoolNames = schools.map((s) => s.name).join(' + ');
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>Applications</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{data.application.student.fullname} &bullet; {schoolNames}</Breadcrumb.Page>
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
		<div class="text-sm">
			<ApplicationStatusSign application={data.application} />
		</div>
	</div>
</section>

<Section id="info">
	<div class="grid grid-cols-2 gap-4">
		<article class="mt-4 text-sm flex flex-col gap-2 bg-zinc-50 p-4 rounded-lg">
			<a href={`/student/${student.id}`}>{student.fullname}</a>
			<div class="flex flex-col gap-2">
				{#each schools as school}
					<a href={`/school/${school.id}`}>{school.name}</a>
				{/each}
			</div>
			<a href={`/program/${program.id}`}>{program.display_name}</a>
			<div>{program_iteration.year} {program_iteration.term}</div>
			<div>{round.name} {round.due_date ?? ''} {round.due_time ?? ''} {round.timezone ?? ''}</div>

			<pre>{JSON.stringify({ services: data.application.services }, null, 2)}</pre>
			{#each data.application.staff.sort() as staff}
				<a href={`/cf/${staff}`}>{staff}</a>
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
		<article class="mt-4 text-sm flex flex-col gap-2 bg-zinc-50 p-4 rounded-lg">
			<div>Logs</div>
			<pre class="bg-zinc-100 p-4 rounded-md">{JSON.stringify(data.application.logs, null, 2)}</pre>
			<Button variant="outline" class="w-fit">New Status</Button>
		</article>
	</div>
</Section>

<Section
	id="coapplications"
	title={`Other Applicants of ${program_iteration.term} ${program_iteration.year}`}
>
	{#await data.coApplications}
		<LoadingSign />
	{:then applications}
		<CoApplicationsDisplay {applications} hideYears noDataMessage="None." />
	{/await}
</Section>

{#if canEdit}
	<Section id="delete" hrule>
		<Button variant="destructive" class="mt-4">Delete Application</Button>
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
